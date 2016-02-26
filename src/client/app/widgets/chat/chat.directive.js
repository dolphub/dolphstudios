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
        controller.$inject = ['$rootScope', 'socket', 'toastr', 'moment', '$interval', '$anchorScroll', 'store'];
        function controller($rootScope, socket, toastr, $interval, $anchorScroll, store) {
            var vm = this;
            vm.title = "Chat";
            vm.textInput = "";
            vm.messages = [];
            vm.isChatLocked = false;

            vm.sendMessage = sendMessage;
            vm.isConnected = isConnected;
            vm.connect = connect;
            vm.disconnect = disconnect;
            vm.toggleChatLock = toggleChatLock;

            // Connect if we were already connected
            if (store.get('chat::connected')) {
                vm.connect();
            }

            if (store.get('chat::lock')) {
                vm.isChatLocked = store.get('chat::lock');
            }
            
            
            function connect() {
                socket.connect();
                socket.on('chatconnection::success', onConnectionSuccess);
                socket.on('chat::message', onChatMessage);
                socket.on('chat::disconnect', onDisconnection);
                store.set('chat::connected', true);
            }

            function disconnect() {
                socket.disconnect();
                store.remove('chat::connected');
            }

            function isConnected() {
                return socket.connected();
            }

            // Broadcast your message
            function sendMessage() {
                if  (vm.textInput.length > 0) {
                    socket.emit('chat::message', { msg: vm.textInput });
                    vm.textInput = "";
                }
            }
                        
            // Connection Successful
            function onConnectionSuccess(sock) {
                vm.messages.push({
                    user: sock.user.name || sock.user.nickname,
                    message: "Has Connected!",
                    info: true,
                    date: new Date()
                });
            };

            function onDisconnection(sock) {
                vm.messages.push({
                    user: sock.user.name || sock.user.nickname,
                    message: "Has Disconnected...",
                    info: true,
                    date: new Date()
                });
            }
            
            // Recieved Chat Message
            function onChatMessage(msg) {
                vm.messages.push(msg);
                scrollToMessage();
                $rootScope.$emit('chatMessage');
                if (!store.get('chat::open') && (!store.get('profile').name || store.get('profile').nickname
                    != msg.user)) {
                    toastr.info(msg.message, 'New Message From: ' + msg.user);
                }                
            };

            function toggleChatLock() {
                vm.isChatLocked = !vm.isChatLocked;
                store.set('chat::lock', vm.isChatLocked);
                $rootScope.$emit('chat::lock', vm.isChatLocked);
            }

            function scrollToMessage() {
                // Animated scroll into view
                $('.chatarea').stop().animate({
                    scrollTop: $('.chatarea')[0].scrollHeight
                }, 1000);                
            }
            
            // Poke model every 30 seconds for moment timestamp updates
            vm.updatePoll = false;
            $interval(function() {
                vm.update = !vm.update;
            }, 30000);            
        }  

        return directive;
    }    
})();