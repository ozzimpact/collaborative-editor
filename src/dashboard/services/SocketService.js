(function () {
    'use strict';

    function dashboardSocketService(socketFactory) {
        var address = window.location.protocol + '//' + window.location.host;
        var details = {
            resource: (window.location.pathname.split('/').slice(0, -1).join('/') + '/socket.io').substring(1),
            transports: ["websocket"]
        };
        var socketInstance = io.connect(address, details);
        return socketFactory({
            ioSocket: socketInstance
        });
    }

    dashboardSocketService.$inject = ['socketFactory'];
    angular
        .module('RDash')
        .factory('dashboardSock', dashboardSocketService);
})();