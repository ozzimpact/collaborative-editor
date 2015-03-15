var io = require('socket.io')
    , redis = require('redis')
    , redisClient = redis.createClient()
    , redisPubClient = redis.createClient()
    , redisSubClient = redis.createClient()
    , redisAdapter = require('socket.io-redis');


module.exports.attach = function (server) {

    var sio = io(server, {
        adapter: redisAdapter({pubClient: redisPubClient, subClient: redisSubClient}),
        'log level': 3
    });

    var roomObj;
    sio.set('transports', ['websocket']);
    sio.set('resource', '/socket.io');

    sio.on('connection', function (socket) {

        redisClient.hkeys('rooms', function (err, reply) {
            if (reply)
                socket.emit('updateRooms', reply);
        });

        if (socket.room != undefined)
            redisClient.hkeys(socket.room, function (err, reply) {
                if (reply)
                    socket.to(socket.room).emit('onlineUsers', reply);
            });


        socket.on('addRoom', function (data) {
            var payload = {
                'owner': data.email,
                'name': data.roomName,
                'created': new Date()
            };

            redisClient.hset('rooms', data.roomName, JSON.stringify(payload), function (err, reply) {
                if (reply) {
                    redisClient.hkeys('rooms', function (err, reply) {
                        if (reply)
                            socket.broadcast.emit('updateRooms', reply);
                    });
                }

            });

            redisClient.hkeys('rooms', function (err, reply) {
                if (reply)
                    socket.emit('updateRooms', reply);
            });

        });
        socket.on('changeRoom', function (room, user) {
            var date = new Date();

            socket.leave(socket.room);
            redisClient.hdel(socket.room, user, function (err, reply) {
                if (reply)
                    redisClient.hkeys(socket.room, function (err, reply) {
                        socket.to(socket.room).emit('onlineUsers', reply);
                        console.log(reply);
                    });
            });

            socket.broadcast.to(socket.room).emit('informRoom', user + ' has left.');
            redisClient.hkeys(socket.room, function (err, reply) {
                socket.to(socket.room).emit('onlineUsers', reply);
                console.log(reply);
            });

            socket.join(room);
            if (socket.room != room) {
                redisClient.hset(room, user, date, function (err, reply) {
                    redisClient.hkeys(room, function (err, reply) {
                        socket.broadcast.to(room).emit('onlineUsers', reply);
                    });
                });
                redisClient.hkeys(room, function (err, reply) {
                    socket.to(room).emit('onlineUsers', reply);
                    console.log(reply);
                    socket.room = room;
                });
                socket.broadcast.to(room).emit('informRoom', user + ' has connected.');

            }
        });


        socket.on('textChanged', function (data) {
            console.log(data);
            //    var payload = {
            //        //'writer': data.email,
            //        'context': data,
            //        'created': new Date(),
            //        'room': 'public'
            //    };
            //    redisClient.hset('textHistory', 'public', JSON.stringify(payload), function (err, reply) {
            //        if (reply) {
            //            redisClient.hgetAll('textHistory', function (err, reply) {
            socket.broadcast.to(socket.room).emit('updateConversation', data);
            //            });
            //        }
            //    });
        });
    });
};