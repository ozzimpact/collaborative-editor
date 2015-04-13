(function () {
    'use strict';

    function userService($http) {
        var baseUrl = '/api/userEmail';
        var getUserDetail = function () {
            return $http({
                method: 'GET',
                url: baseUrl
            });
        };
        return {
            getUserDetail: getUserDetail
        };
    }

    userService.$inject = ['$http'];
    angular
        .module('collaborativeEditor')
        .factory('userService', userService);
})();