(function () {
    'use strict';

    function userService($http) {
        var baseUrl = '/api/users';
        var getUsers = function () {
            return $http({
                method: 'GET',
                url: baseUrl
            });
        };
        return {
            getUsers: getUsers
        };
    }

    userService.$inject = ['$http'];
    angular
        .module('RDash')
        .factory('userService', userService);
})();
