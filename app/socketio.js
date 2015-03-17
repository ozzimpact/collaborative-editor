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

            socket.leave(socket.room);
            redisClient.hdel(socket.room, user, function (err, reply) {
                if (reply)
                    redisClient.hkeys(socket.room, function (err, reply) {
                        sio.sockets.to(socket.room).emit('onlineUsers', reply);
                    });
            });
            socket.broadcast.to(socket.room).emit('informRoom', user + ' has left.');

            socket.join(room);
            if (socket.room != room) {
                socket.room = room;
                redisClient.hset(room, user, date, function (err, reply) {
                    redisClient.hkeys(room, function (err, reply) {
                        sio.sockets.to(room).emit('onlineUsers', reply)

                    });
                });
                redisClient.hget(socket.room, 'text', function (err, reply) {
                    if(reply)
                        sio.sockets.to(socket.room).emit('updateConversation', JSON.parse(reply));
                });
                socket.broadcast.to(room).emit('informRoom', user + ' has connected.');

            }
        });

        socket.on('textChanged', function (payload) {

            redisClient.hset(socket.room,'text',JSON.stringify(payload.content), function (err, reply) {
                if(err)
                console.log(err);

            });
                redisClient.hget(socket.room, 'text', function (err, reply) {
                    if(reply)
                        socket.broadcast.to(socket.room).emit('updateConversation', JSON.parse(reply));
                    console.log(reply);
                });


        });
    });
};