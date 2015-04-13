(function () {
    'use strict';

    function rdLoading() {
        var directive = {
            restrict: 'AE',
            template: [
                '<div class="loading">'
                , '<div class="double-bounce1"></div>'
                , '<div class="double-bounce2"></div>'
                , '</div>'].join('')
        };
        return directive;
    }

    angular
        .module('RDash')
        .directive('rdLoading', rdLoading);
})();