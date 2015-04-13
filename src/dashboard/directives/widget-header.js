(function () {
    'use strict';

    function rdWidgetTitle() {
        var directive = {
            requires: '^rdWidget',
            scope: {
                title: '@',
                icon: '@'
            },
            transclude: true,
            template: ['<div class="widget-header">'
                , '<div class="row">'
                , '<div class="pull-left">'
                , '<i class="fa" ng-class="icon"></i>'
                , ' {{title}} </div>'
                , '<div class="pull-right col-xs-6 col-sm-4" ng-transclude></div>'
                , '</div>'
                , '</div>'].join(''),
            restrict: 'E'
        };
        return directive;
    }

    angular
        .module('RDash')
        .directive('rdWidgetHeader', rdWidgetTitle);
})();