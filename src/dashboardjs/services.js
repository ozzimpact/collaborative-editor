(function () {
    'use strict';

    dashboardApp
        .factory('dashboardSock', ['socketFactory', function (socketFactory) {

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

    dashboardApp.factory('requestService', function ($http) {
        var baseUrl = '/api/requestnumber';
        var getRequestNumber = function () {
            return $http({
                method: 'GET',
                url: baseUrl
            });
        };

        return {
            getRequestNumber: getRequestNumber
        };
    });

    dashboardApp.factory('roomService', function ($http) {
        var baseUrl = '/api/rooms';
        var getRooms = function () {
            return $http({
                method: 'GET',
                url: baseUrl
            });
        };
        return {
            getRooms: getRooms
        };
    });

})();
