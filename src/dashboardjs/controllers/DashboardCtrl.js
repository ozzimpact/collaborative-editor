(function () {
    'use strict';

    function DashboardCtrl($scope, $cookieStore, socketio, requestService, roomService, usersService) {

        var mobileView = 992;
        $scope.vm = {
            usernumber: '',
            users: [],
            requestnumber: '',
            roomnumber: '',
            onlineusers: '',
            roomnames: [],
            numberOfUsersInRooms: [],
            namesOfUsersInRooms: []
        };

        $scope.getRoomStatistics = function () {
            roomService.getRooms().then(function (res) {
                $scope.vm.roomnames = res.data;
                $scope.vm.onlineusers = 0;
                $scope.vm.roomnames.forEach(function (room) {
                    roomService.getRoomUsers(room).then(function (res) {
                        $scope.vm.numberOfUsersInRooms.push(res.data.length);
                        $scope.vm.onlineusers += res.data.length;
                        res.data.forEach(function (obj) {
                            $scope.vm.namesOfUsersInRooms.push(obj);

                        })
                    });
                });
            });
            console.log($scope.vm.namesOfUsersInRooms.indexOf('oguzhandemir92@hoasdasd'));
        };
        $scope.getUserDetail = function () {
            usersService.getUsers().then(function (res) {
                res.data.forEach(function (obj) {
                    $scope.vm.users.push(obj.local.email);
                });
                $scope.vm.usernumber = res.data.length;
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
                $scope.vm.requestnumber = res.data;
            });
        };

        $scope.handleRoomNumber = function (evt, payload) {
            roomService.getRooms().then(function (res) {
                $scope.vm.roomnames = res.data;
                $scope.vm.roomnumber = $scope.vm.roomnames.length;
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