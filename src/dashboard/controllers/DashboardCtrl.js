(function () {
    'use strict';

    function DashboardCtrl($scope, $cookieStore, socketio, requestService, roomService, userService) {
        var vm = this;
        var mobileView = 992;

        vm.userNumber = '';
        vm.users = [];
        vm.requestNumber = '';
        vm.roomNumber = '';
        vm.roomNames = [];
        vm.numberOfUsersInRooms = [];
        vm.getRoomStatistics = getRoomStatistics;
        vm.getUserDetail = getUserDetail;
        vm.bootstrap = bootstrap;
        vm.getWidth = getWidth;
        vm.toggleSidebar = toggleSidebar;
        vm.handleRequestNumber = handleRequestNumber;
        vm.handleRoomNumber = handleRoomNumber;
        vm.handleUsersChanged = handleUsersChanged;

        function getRoomStatistics() {
            roomService.getRooms().then(function (res) {
                vm.roomNames = res.data;
                vm.onlineUserNumber = 0;
                vm.roomNames.forEach(function (room) {
                    roomService.getRoomUsers(room).then(function (res) {
                        vm.numberOfUsersInRooms[room] = res.data.length;
                        vm.onlineUserNumber += res.data.length;
                        //$scope.vm.namesOfUsersInRooms[]
                    });
                });
            });
        }

        function getUserDetail() {
            vm.users = [];
            userService.getUsers().then(function (res) {
                res.data.forEach(function (obj) {
                    vm.users.push(obj);
                });
                vm.userNumber = res.data.length;
            });
        }

        function bootstrap() {
            vm.getUserDetail();
            vm.handleRequestNumber();
            vm.handleRoomNumber();
            vm.getRoomStatistics();
        }

        function getWidth() {
            return window.innerWidth;
        }

        $scope.$watch(vm.getWidth, function (newValue) {
            if (newValue >= mobileView) {
                if (angular.isDefined($cookieStore.get('toggle'))) {
                    vm.toggle = !$cookieStore.get('toggle') ? false : true;
                } else {
                    vm.toggle = true;
                }
            } else {
                vm.toggle = false;
            }
        });

        function toggleSidebar() {
            vm.toggle = !vm.toggle;
            $cookieStore.put('toggle', vm.toggle);
        }

        window.onresize = function () {
            $scope.$apply();
        };

        function handleRequestNumber(evt) {
            requestService.getRequestNumber().then(function (res) {
                vm.requestNumber = res.data;
            });
        }

        function handleRoomNumber(evt) {
            roomService.getRooms().then(function (res) {
                vm.roomNames = res.data;
                vm.roomNumber = vm.roomNames.length;
                vm.getRoomStatistics();
            });
        }

        function handleUsersChanged(evt) {
            vm.getRoomStatistics();
        }


        $scope.$on('socket:requestNum', vm.handleRequestNumber);
        socketio.forward('requestNum', $scope);
        $scope.$on('socket:updateRooms', vm.handleRoomNumber);
        socketio.forward('updateRooms', $scope);
        $scope.$on('socket:usernumberchanged', vm.handleUsersChanged);
        socketio.forward('usernumberchanged', $scope);
        $scope.$on('socket:newUser', vm.getUserDetail);
        socketio.forward('newUser', $scope);

        vm.bootstrap();
    }

    DashboardCtrl.$inject = ['$scope', '$cookieStore', 'dashboardSock', 'requestService', 'roomService', 'userService'];
    angular
        .module('RDash')
        .controller('DashboardCtrl', DashboardCtrl);
})();
