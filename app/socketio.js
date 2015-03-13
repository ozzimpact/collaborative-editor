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

            //socket.broadcast.emit('updateConversation', user + ' has disconnected.');


            redisClient.hkeys('onlineUsers', function (err, reply) {
                console.log(reply+ 'online');
            });


            if (socket.room != undefined) {
                socket.leave(socket.room);
                redisClient.hset('onlineUsers', socket.room, user, redis.print);
            }
            if (socket.room != undefined && socket.room != room)
                socket.broadcast.to(socket.room).emit('informRoom', user + ' has left.');
            socket.join(room);
            if (socket.room != undefined && socket.room != room)
                socket.broadcast.to(room).emit('informRoom', user + ' has connected.');
            socket.room = room;
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