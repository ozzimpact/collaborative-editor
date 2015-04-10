(function () {
    'use strict';

    function DashboardCtrl($scope, $cookieStore, socketio, requestService, roomService, usersService) {

        var mobileView = 992;
        $scope.vm = {
            userNumber: '',
            users: [],
            requestNumber: '',
            roomNumber: '',
            onlineUserNumber: '',
            roomNames: [],
            numberOfUsersInRooms: [],
            namesOfUsersInRooms: $scope.vm.users
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
            usersService.getUsers().then(function (res) {ş
                res.data.forEach(function (obj) {
                    $scope.vm.users.push(obj.local.email);
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
                $scope.vm.requestNumber = res.data;
            });
        };

        $scope.handleRoomNumber = function (evt, payload) {
            roomService.getRooms().then(function (res) {
                $scope.vm.roomNames = res.data;
                $scope.vm.roomNumber = $scope.vm.roomNames.length;
                $scope.getRoomStatistics();
            });
        };
        $scope.handleUsersChanged = function (evt, payload) {
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

    dashboardApp
        .controller('DashboardCtrl', ['$scope', '$cookieStore', 'dashboardSock', 'requestService', 'roomService', 'usersService', DashboardCtrl]);


})();