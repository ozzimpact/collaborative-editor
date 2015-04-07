(function () {
    'use strict';

    dashboardApp
        .controller('MasterCtrl', ['$scope', '$cookieStore', 'dashboardSock', function ($scope, $cookieStore, socketio) {
            /**
             * Sidebar Toggle & Cookie Control
             */
            $scope.usernumber = 10;
            var mobileView = 992;

            $scope.getWidth = function () {
                return window.innerWidth;
            };

            $scope.$watch($scope.getWidth, function (newValue, oldValue) {
                if (newValue >= mobileView) {
                    if (angular.isDefined($cookieStore.get('toggle'))) {
                        $scope.toggle = !$cookieStore.get('toggle') ? false : true;
                    } else {
                        $scope.toggle = true;
                    }
                } else {
                    $scope.toggle = false;
                }

            });

            $scope.toggleSidebar = function () {
                $scope.toggle = !$scope.toggle;
                $cookieStore.put('toggle', $scope.toggle);
            };

            window.onresize = function () {
                $scope.$apply();
            };

            $scope.handleRequestNumber = function (reqNum) {
                $scope.reqNum = reqNum;
                console.log(reqNum);
            };

            $scope.$on('socket:requestNum', $scope.handleRequestNumber);
            socketio.forward('requestNum', $scope);

        }]);

})();