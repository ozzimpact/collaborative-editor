(function () {
    'use strict';

    dashboardApp
        .controller('MasterCtrl', ['$scope', '$cookieStore', 'dashboardSock', 'requestService', function ($scope, $cookieStore, socketio, requestService) {
            /**
             * Sidebar Toggle & Cookie Control
             */
            var mobileView = 992;
            $scope.vm = {
                usernumber: '',
                requestnumber: '',
                rooms: '',
                onlineusers: ''
            };
            $scope.usernumber = '';

            $scope.bootstrap = function () {
                $scope.handleRequestNumber();
                $scope.handleRoomNumber();
            };

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

            $scope.handleRequestNumber = function (evt, payload) {
                $scope.vm.requestnumber = payload;
            };

            $scope.handleRoomNumber = function (evt, payload) {
                $scope.vm.rooms = payload;
            };
            $scope.$on('socket:requestNum', $scope.handleRequestNumber);
            socketio.forward('requestNum', $scope);
            $scope.$on('socket:roomNum', $scope.handleRoomNumber);
            socketio.forward('roomNum', $scope);

            $scope.bootstrap();
        }]);


})();