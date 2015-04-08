(function () {
    'use strict';

    //todo var all of them
    var io = require('socket.io'),
        redis = require('redis'),
        redisClient = redis.createClient(),
        redisPubClient = redis.createClient(),
        redisSubClient = redis.createClient(),
        redisAdapter = require('socket.io-redis');
    var reqNum = 0;

    module.exports.attach = function (server) {

        var sio = io(server, {
            adapter: redisAdapter({pubClient: redisPubClient, subClient: redisSubClient}),
            'log level': 3
        });
        sio.set('transports', ['websocket']);
        sio.set('resource', '/socket.io');
        sio.on('connection', function (socket) {

            redisClient.hkeys('rooms', function (err, reply) {
                if (reply)
                    sio.sockets.emit('updateRooms', reply);
            });

            socket.on('addRoom', function (data) {
                var payload = {
                    'owner': data.email,
                    'name': data.roomName,
                    'created': new Date()
                };

                redisClient.hset('rooms', data.roomName, JSON.stringify(payload), function (err, reply) {

                    if (err) {
                        console.log(err);
                    }

                    if (reply) {
                        redisClient.hkeys('rooms', function (err, reply) {

                            if (reply)
                                sio.sockets.emit('updateRooms', reply);
                        });
                    }
                });
            });

            socket.on('changeRoom', function (room, user) {
                var date = new Date();
                var oldRoom = socket.room;
                socket.leave(oldRoom);
                redisClient.hdel(oldRoom, user, function (err, reply) {

                    if (reply)
                        redisClient.hkeys(oldRoom, function (err, reply) {
                            sio.sockets.to(oldRoom).emit('onlineUsers', reply);
                        });
                });
                socket.broadcast.to(oldRoom).emit('informRoom', user + ' has left.');
                socket.join(room);

                if (socket.room != room) {
                    socket.room = room;
                    redisClient.hset(room, user, date, function (err, reply) {
                        redisClient.hkeys(room, function (err, reply) {
                            sio.sockets.to(room).emit('onlineUsers', reply);
                        });
                    });
                    redisClient.hget('history', socket.room, function (err, reply) {

                        if (reply)
                            sio.sockets.to(socket.room).emit('updateConversation', JSON.parse(reply));
                        else
                            sio.sockets.to(socket.room).emit('updateConversation', '');
                    });
                    socket.broadcast.to(room).emit('informRoom', user + ' has connected.');
                }
            });

            socket.on('textChanged', function (payload) {
                redisClient.set('requestNumber', JSON.stringify(++reqNum), function (err, reply) {

                    if (err)
                        console.log(err);
                    else {
                        redisClient.get('requestNumber', function (err, reply) {

                            if (reply)
                                sio.sockets.emit('requestNum', JSON.parse(reply));
                        });
                    }

                });
                redisClient.hset('history', socket.room, JSON.stringify(payload.content), function (err, reply) {

                    if (err)
                        console.log(err);
                });
                redisClient.hget('history', socket.room, function (err, reply) {
                    if (reply)
                        socket.broadcast.to(socket.room).emit('updateConversation', JSON.parse(reply));
                });
            });
        });
    };
})();