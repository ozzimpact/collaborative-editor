(function () {
    'use strict';

    function editorSocketService(socketFactory) {
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

    editorSocketService.$inject = ['socketFactory'];
    angular
        .module('collaborativeEditor')
        .factory('editorSocketService', editorSocketService);


})();