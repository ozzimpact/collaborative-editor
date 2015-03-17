(function () {
    'use strict';

    app.controller('EditorCtrl', ['$scope', 'collaSocket', 'userService', 'Notification', function ($scope, socketio, userService, Notification) {
        $scope.vm = {
            htmlcontent: '',
            username: '',
            currentRoom: '',
            Rooms: null,
            online: null

        };
        $scope.bootstrap = function () {
            userService.getUserDetail().then(function (dataResponse) {
                $scope.vm.username = dataResponse.data;
            });
        };

        $scope.sendContent = function (content) {
            var payload = {
              user:$scope.vm.username,
                content:content
            };
            socketio.emit('textChanged', payload);
        };
        $scope.chooseRoom = function (room) {
            $scope.vm.currentRoom = room;
            socketio.emit('changeRoom', room, $scope.vm.username);
        };

        $scope.addNewRoom = function () {
            socketio.emit('addRoom', {roomName: prompt('Room Name'), email: $scope.vm.username});
        };

        $scope.handleUpdateRooms = function (evt, payload) {
            $scope.vm.Rooms = payload;
        };

        $scope.handleUpdateConversation = function (evt, payload) {

            $scope.vm.htmlcontent = payload;
        };

        $scope.handleInformRoom = function (evt, connected) {
            Notification.info(connected);

        };
        $scope.handleOnlineUsers = function (evt, payload) {
            $scope.vm.online = payload;
        };

        $scope.$on('socket:updateRooms', $scope.handleUpdateRooms);
        $scope.$on('socket:updateConversation', $scope.handleUpdateConversation);
        $scope.$on('socket:informRoom', $scope.handleInformRoom);
        $scope.$on('socket:onlineUsers', $scope.handleOnlineUsers);
        socketio.forward('updateRooms', $scope);
        socketio.forward('updateConversation', $scope);
        socketio.forward('informRoom', $scope);
        socketio.forward('onlineUsers', $scope);

        $scope.bootstrap();
    }]);
})();

