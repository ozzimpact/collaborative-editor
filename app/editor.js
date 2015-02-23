'use strict';



app.controller('EditorCtrl', ['$scope', 'collaSocket', function ($scope, socketio) {
    $scope.htmlcontent  = '';
    $scope.disabled = false;

    $scope.$watch('htmlcontent',function(data){
        socketio.emit('textChanged',data);
    });

    $scope.switchRoom = function (rm) {
        console.log(rm);
    };
    $scope.trial = function () {
        socketio.emit('addRoom', {roomName: prompt('Room Name'), email: 'oguzhan.demir@trendyol.com'});
    };

    $scope.handleSocket = function (evt, payload) {
        console.log(payload);
    };

    $scope.handleUupdateRooms = function (evt, payload) {
        $scope.Rooms = payload;
    };
    $scope.handleUpdateConversation = function (evt, payload) {
        //for(var key in Object.keys(payload)){
        //$scope.htmlcontent = Object.keys(payload)[key].context;
        //}
        $scope.htmlcontent = payload;
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