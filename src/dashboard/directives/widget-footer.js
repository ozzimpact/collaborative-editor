(function () {
    'use strict';

    function rdWidgetFooter() {
        var directive = {
            requires: '^rdWidget',
            transclude: true,
            template: '<div class="widget-footer" ng-transclude></div>',
            restrict: 'E'
        };
        return directive;
    }

    angular
        .module('RDash')
        .directive('rdWidgetFooter', rdWidgetFooter);
})();