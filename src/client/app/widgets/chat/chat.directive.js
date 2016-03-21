(function() {
    angular.module('app.widgets')
    .directive('chat', Chat);
    
    /* @ngInject */
    function Chat() {
        var directive = {
            bindToController: true,
            controller: controller,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {},
            templateUrl: 'app/widgets/chat/chat.html'
        }
        return directive;
        
        /* @ngInject */
        controller.$inject = ['$rootScope', 'logger', 'socket', 'toastr', 'moment', '$interval', 'store', 'Chat'];
        function controller($rootScope, logger, socket, toastr, $interval, store, Chat) {
            var vm = this;
            vm.title = "Chat";
            vm.pMessages = [];
            vm.users = [];
            vm.isChatLocked = false;

            vm.isConnected = isConnected;
            vm.toggleChatLock = toggleChatLock;
            vm.userTabClick = userTabClick;
            

            socket.on('chat::connection:success', onConnectionSuccess);
            socket.on('chat::connection:disconnect', onDisconnection);

            if (store.get('chat::lock')) {
                vm.isChatLocked = store.get('chat::lock');
            }

            function isConnected() {
                return socket.connected();
            }

            // Broadcast the chat lock functionality
            function toggleChatLock() {
                vm.isChatLocked = !vm.isChatLocked;
                store.set('chat::lock', vm.isChatLocked);
                $rootScope.$emit('chat::lock', vm.isChatLocked);
            }

            function userTabClick() {
                $rootScope.$emit('chat::users:view');
            }

            function onConnectionSuccess(sock) {
                var msg = {
                    user: sock.user.name || sock.user.nickname,
                    message: "Has Connected!",
                    info: true,
                    date: new Date()
                };
                $rootScope.$emit('chat::connection:statusChange', msg);
                $rootScope.$emit('chat::users:update', sock.users);
            };

            function onDisconnection(sock) {
                var msg = {
                    user: sock.user.name || sock.user.nickname,
                    message: "Has Disconnected...",
                    info: true,
                    date: new Date()
                };
                $rootScope.$emit('chat::connection:statusChange', msg);
                $rootScope.$emit('chat::users:update', sock.users);
                // setUsers(sock.users);
            }
            
            // HACK:: Manually trigger cycle digest to update message time stamps
            // Poke model every 30 seconds for moment timestamp updates
            vm.updatePoll = false;
            $interval(function() {
                vm.update = !vm.update;
            }, 30000);      
        }

        return directive;
    }    
})();