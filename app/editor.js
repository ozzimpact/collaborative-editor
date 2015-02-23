'use strict';


app.controller('EditorCtrl', ['$scope', 'collaSocket', function ($scope, socketio) {

    $scope.htmlcontent = '';
    $scope.disabled = false;

    $scope.$watch('htmlcontent', function (newVal, oldVal) {
        socketio.emit('textChanged', newVal);
    });

    $scope.chooseRoom = function (room) {
        socketio.emit('changeRoom', room, $('.userEmail').text());
    };

    $scope.addNewRoom = function () {
        socketio.emit('addRoom', {roomName: prompt('Room Name'), email: 'oguzhan.demir@trendyol.com'});
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

