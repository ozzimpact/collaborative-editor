'use strict';


app.controller('EditorCtrl', ['$scope', 'collaSocket', function ($scope, socketio) {
    $scope.orightml = '';
    $scope.htmlcontent = $scope.orightml;
    $scope.disabled = false;

    $scope.trial = function () {
        socketio.emit('addRoom', {roomName: prompt('Room Name'), email: 'oguzhan.demir@trendyol.com'});
    };
    $scope.sendContext = function (data) {
      socketio.emit('textChanged',{context:$scope.htmlcontent, email: 'oguzhan.demir@trendyol.com'});
    };

    $scope.handleSocket = function (evt, payload) {
        console.log(payload);
    };

    $scope.handleUupdateRooms = function (evt, payload) {
        $scope.Rooms = Object.keys(payload);
    };
    $scope.handleUpdateConversation = function (evt, payload) {
        for(var key in Object.keys(payload)){
        $scope.htmlcontent = Object.keys(payload)[key].context;
        }
        };

    $scope.$on('socket:addRoom', $scope.handleSocket);
    $scope.$on('socket:updateRooms', $scope.handleUupdateRooms);
    $scope.$on('socket:updateConversation', $scope.handleUpdateConversation);
    socketio.forward('addRoom', $scope);
    socketio.forward('updateRooms', $scope);
    socketio.forward('updateConversation', $scope);
}]);

//
//function EditorCtrl($scope,socket){
//    $scope.orightml = '';
//    $scope.htmlcontent = $scope.orightml;
//    $scope.disabled = false;
//
//    $scope.trial = function () {
//        console.log('deneme1212');
//        socket.emit('connection','socketemitinit');
//
//        socket.on('connection', function (str) {
//           console.log(str);
//        });
//
//    };
//};