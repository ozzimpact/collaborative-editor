(function () {
    'use strict';


    app.factory('collaSocket', ['socketFactory', function (socketFactory) {

        var address = window.location.protocol + '//' + window.location.host;
        var details = {
            resource: (window.location.pathname.split('/').slice(0, -1).join('/') + '/socket.io').substring(1),
            transports: ["websocket"]
        };
        var socketInstance = io.connect(address, details);
        return socketFactory({
            ioSocket: socketInstance
        });
    }]);
    app.factory('userService', function ($http) {
        var baseUrl = '/userEmail';
        var getUserDetail = function () {
            return $http({
                method: 'GET',
                url: baseUrl
            });
        };

        return {
            getUserDetail: getUserDetail
        };
    });

})();
