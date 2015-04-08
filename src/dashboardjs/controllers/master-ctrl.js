(function () {
    'use strict';

    dashboardApp
        .controller('MasterCtrl', ['$scope', '$cookieStore', 'dashboardSock', 'requestService', 'roomService', function ($scope, $cookieStore, socketio, requestService, roomService) {
            /**
             * Sidebar Toggle & Cookie Control
             */
            var mobileView = 992;
            $scope.vm = {
                usernumber: '',
                requestnumber: '',
                roomnumber: '',
                onlineusers: '',
                rooms:[]
            };
            roomService.getRooms().then(function (res) {
                $scope.vm.rooms = res.data;
            });

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
                requestService.getRequestNumber().then(function (res) {
                    $scope.vm.requestnumber = res.data;
                });
            };

            $scope.handleRoomNumber = function (evt, payload) {
                roomService.getRooms().then(function (res) {
                    rooms = res.data;
                    $scope.vm.roomnumber = rooms.length;
                });

            };
            $scope.$on('socket:requestNum', $scope.handleRequestNumber);
            socketio.forward('requestNum', $scope);
            $scope.$on('socket:updateRooms', $scope.handleRoomNumber);
            socketio.forward('updateRooms', $scope);

            $scope.bootstrap();
        }]);


})();