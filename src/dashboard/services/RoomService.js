(function () {
    'use strict';

    function roomService($http) {
        var baseUrl = '/api/rooms';
        var getRooms = function () {
            return $http({
                method: 'GET',
                url: baseUrl
            });
        };
        var getRoomUsers = function (room) {
            return $http({
                method: 'GET',
                url: baseUrl + '/' + room
            });
        };
        return {
            getRooms: getRooms,
            getRoomUsers: getRoomUsers
        };
    }

    roomService.$inject = ['$http'];
    angular
        .module('RDash')
        .factory('roomService', roomService);
})();
