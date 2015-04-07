angular.module('RDash', ['ui.bootstrap', 'ui.router', 'ngCookies', 'btford.socket-io', 'MasterCtrl'])
    .factory('dashboardSock', function (socketFactory) {

        var address = window.location.protocol + '//' + window.location.host;
        var details = {
            resource: (window.location.pathname.split('/').slice(0, -1).join('/') + '/socket.io').substring(1),
            transports: ["websocket"]
        };
        var socketInstance = io.connect(address, details);
        return socketFactory({
            ioSocket: socketInstance
        });
    }).factory('requestService', function ($http) {
        var baseUrl = '/request';
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