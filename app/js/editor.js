'use strict';


app.controller('EditorCtrl', function ($scope,socket) {
    $scope.orightml = '';
    $scope.htmlcontent = $scope.orightml;
    $scope.disabled = false;

    $scope.trial = function () {
        console.log('deneme1212');
        socket.emit('connection','socketemitinit');

        socket.on('connection', function (str) {
            console.log(str);
        });

    };
});

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