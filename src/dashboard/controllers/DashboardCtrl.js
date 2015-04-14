(function () {
    'use strict';

    function DashboardCtrl($scope, $cookieStore, socketio, requestService, roomService, userService) {

        var mobileView = 992;
        $scope.vm = {
            userNumber: '',
            users: [],
            requestNumber: '',
            roomNumber: '',
            onlineUserNumber: '',
            roomNames: [],
            numberOfUsersInRooms: []
        };

        $scope.getRoomStatistics = function () {
            roomService.getRooms().then(function (res) {
                $scope.vm.roomNames = res.data;
                $scope.vm.onlineUserNumber = 0;
                $scope.vm.roomNames.forEach(function (room) {
                    roomService.getRoomUsers(room).then(function (res) {
                        $scope.vm.numberOfUsersInRooms[room] = res.data.length;
                        $scope.vm.onlineUserNumber += res.data.length;
                        //$scope.vm.namesOfUsersInRooms[]
                    });
                });
            });

        };
        $scope.getUserDetail = function () {
          $scope.vm.users = [];
            userService.getUsers().then(function (res) {
                res.data.forEach(function (obj) {
                    $scope.vm.users.push(obj);
                });
                $scope.vm.userNumber = res.data.length;
            });
        };

        $scope.bootstrap = function () {
            $scope.getUserDetail();
            $scope.handleRequestNumber();
            $scope.handleRoomNumber();
            $scope.getRoomStatistics();
        };

        $scope.getWidth = function () {
            return window.innerWidth;
        };
        $scope.$watch($scope.getWidth, function (newValue) {
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

        $scope.handleRequestNumber = function (evt) {
            requestService.getRequestNumber().then(function (res) {
                $scope.vm.requestNumber = res.data;
            });
        };

        $scope.handleRoomNumber = function (evt) {
            roomService.getRooms().then(function (res) {
                $scope.vm.roomNames = res.data;
                $scope.vm.roomNumber = $scope.vm.roomNames.length;
                $scope.getRoomStatistics();
            });
        };
        $scope.handleUsersChanged = function (evt) {
            $scope.getRoomStatistics();
        };


        $scope.$on('socket:requestNum', $scope.handleRequestNumber);
        socketio.forward('requestNum', $scope);
        $scope.$on('socket:updateRooms', $scope.handleRoomNumber);
        socketio.forward('updateRooms', $scope);
        $scope.$on('socket:usernumberchanged', $scope.handleUsersChanged);
        socketio.forward('usernumberchanged', $scope);
        $scope.$on('socket:newUser', $scope.getUserDetail);
        socketio.forward('newUser', $scope);

        $scope.bootstrap();
    }

    DashboardCtrl.$inject = ['$scope', '$cookieStore', 'dashboardSock', 'requestService', 'roomService', 'userService'];
    angular
        .module('RDash')
        .controller('DashboardCtrl', DashboardCtrl);
})();
