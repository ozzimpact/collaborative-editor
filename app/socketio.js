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

    sio.sockets.on('connection', function (socket) {

        redisClient.hgetall('rooms', function (err, reply) {
            socket.emit('updateRooms', reply);
        });
        socket.on('addRoom', function (data) {
            var payload = {
                'owner': data.email,
                'name': data.roomName,
                'created': new Date()
            };

            redisClient.hset('rooms', data.roomName, JSON.stringify(payload), function (err, reply) {
               if(reply) {
                   redisClient.hgetall('rooms', function (err, reply) {
                       socket.emit('updateRooms', reply);
                   });
              }
        });
    });
        socket.on('textChanged', function (data) {
            var payload = {
                'writer': data.email,
                'context': data.context,
                'created': new Date(),
                'room': 'public'
            };
            redisClient.hset('textHistory', 'public', JSON.stringify(payload), function (err,reply) {
                if(reply){
                    //redisClient.hgetAll('textHistory', function (err, reply) {
                    //    socket.emit('updateConversation', reply);
                    //});
                }
            } );
        });
});
};