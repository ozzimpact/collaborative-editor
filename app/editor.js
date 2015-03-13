(function () {
    'use strict';

    app.controller('EditorCtrl', ['$scope', 'collaSocket','userService','Notification',function ($scope, socketio, userService, Notification) {

        $scope.htmlcontent = '';
        $scope.disabled = false;
        $scope.username = '';
        $scope.currentRoom ='';

        $scope.bootstrap= function () {
            userService.getUserDetail().then(function (dataResponse) {
                $scope.username = dataResponse.data;
            });
        };

        $scope.sendContent = function (newVal) {
            socketio.emit('textChanged', newVal);
        };
        $scope.chooseRoom = function (room) {
            $scope.currentRoom = room;
            socketio.emit('changeRoom', room, $scope.username);
        };

        $scope.addNewRoom = function () {
            socketio.emit('addRoom', {roomName: prompt('Room Name'), email: $scope.username});
        };

        $scope.handleUpdateRooms = function (evt, payload) {
            $scope.Rooms = payload;
        };

        $scope.handleUpdateConversation = function (evt, payload) {

            $scope.htmlcontent = payload;
        };

        $scope.handleInformRoom = function (evt, connected) {
            Notification.info(connected);

        };


        $scope.$on('socket:updateRooms', $scope.handleUpdateRooms);
        $scope.$on('socket:updateConversation', $scope.handleUpdateConversation);
        $scope.$on('socket:informRoom', $scope.handleInformRoom);
        socketio.forward('updateRooms', $scope);
        socketio.forward('updateConversation', $scope);
        socketio.forward('informRoom', $scope);

        $scope.bootstrap();
    }]);
})();

