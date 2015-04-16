(function () {
    'use strict';

    function EditorCtrl($scope, socketio, userService, Notification) {
        var vm = this;

        vm.htmlcontent = '';
        vm.username = '';
        vm.currentRoom = '';
        vm.Rooms = null;
        vm.online = null;
        vm.bootstrap = bootstrap;
        vm.sendContent = sendContent;
        vm.chooseRoom = chooseRoom;
        vm.addNewRoom = addNewRoom;
        vm.handleUpdateRooms = handleUpdateRooms;
        vm.handleUpdateConversation = handleUpdateConversation;
        vm.handleInformRoom = handleInformRoom;
        vm.handleOnlineUsers = handleOnlineUsers;


        function bootstrap() {
            userService.getUserDetail().then(function (dataResponse) {
                vm.username = dataResponse.data;
            });
        }

        function sendContent(content) {
            var payload = {
                user: vm.username,
                content: content
            };
            socketio.emit('textChanged', payload);
        }

        function chooseRoom(room) {
            vm.currentRoom = room;
            socketio.emit('changeRoom', room, vm.username);
        }

        function addNewRoom() {
            socketio.emit('addRoom', {roomName: prompt('Room Name'), email: vm.username});
        }

        function handleUpdateRooms(evt, payload) {
            vm.Rooms = payload;
        }

        function handleUpdateConversation(evt, payload) {

            vm.htmlcontent = payload;
        }

        function handleInformRoom(evt, connected) {
            Notification.info(connected);

        }

        function handleOnlineUsers(evt, payload) {
            vm.online = payload;
        }

        $scope.$on('socket:updateRooms', vm.handleUpdateRooms);
        $scope.$on('socket:updateConversation', vm.handleUpdateConversation);
        $scope.$on('socket:informRoom', vm.handleInformRoom);
        $scope.$on('socket:onlineUsers', vm.handleOnlineUsers);
        socketio.forward('updateRooms', $scope);
        socketio.forward('updateConversation', $scope);
        socketio.forward('informRoom', $scope);
        socketio.forward('onlineUsers', $scope);

        vm.bootstrap();
    }

    EditorCtrl.$inject = ['$scope', 'editorSocketService', 'userService', 'Notification'];
    angular
        .module('collaborativeEditor')
        .controller('EditorCtrl', EditorCtrl);
})();

