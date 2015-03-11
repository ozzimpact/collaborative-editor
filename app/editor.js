'use strict';


app.controller('EditorCtrl', ['$scope', 'collaSocket','userService',function ($scope, socketio, userService) {

    $scope.htmlcontent = '';
    $scope.disabled = false;
    $scope.username = '';
    $scope.currentRoom ='';


     userService.getUserDetail().then(function (dataResponse) {
            $scope.username = dataResponse.data;
        });

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

    $scope.handleSocket = function (evt, payload) {
        console.log(payload);
    };

    $scope.handleUpdateRooms = function (evt, payload) {
        $scope.Rooms = payload;
    };

    $scope.handleUpdateConversation = function (evt, payload) {

        $scope.htmlcontent = payload;
    };

    $scope.$on('socket:addRoom', $scope.handleSocket);
    $scope.$on('socket:updateRooms', $scope.handleUpdateRooms);
    $scope.$on('socket:updateConversation', $scope.handleUpdateConversation);
    socketio.forward('addRoom', $scope);
    socketio.forward('updateRooms', $scope);
    socketio.forward('updateConversation', $scope);

}]);
