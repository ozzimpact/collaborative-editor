(function () {
    'use strict';

    function rdWidget() {
        var directive = {
            transclude: true,
            template: '<div class="widget" ng-transclude></div>',
            restrict: 'EA'
        };
        return directive;
    }

    angular
        .module('RDash')
        .directive('rdWidget', rdWidget);
})();