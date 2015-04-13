(function () {
    'use strict';

    function requestService($http) {
        var baseUrl = '/api/requestNumber';
        var getRequestNumber = function () {
            return $http({
                method: 'GET',
                url: baseUrl
            });
        };
        return {
            getRequestNumber: getRequestNumber
        };
    }

    requestService.$inject = ['$http'];
    angular
        .module('RDash')
        .factory('requestService', requestService);
})();
