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
        controller.$inject = ['$rootScope', 'logger', 'socket', 'toastr', 'moment', '$interval', '$anchorScroll', 'store', 'Chat'];
        function controller($rootScope, logger, socket, toastr, $interval, $anchorScroll, store, Chat) {
            var vm = this;
            vm.title = "Chat";
            vm.textInput = "";
            vm.globalMessages = [];
            vm.pMessages = [];
            vm.users = [];
            vm.isChatLocked = false;

            vm.sendMessage = sendMessage;
            vm.isConnected = isConnected;
            vm.connect = connect;
            vm.disconnect = disconnect;
            vm.toggleChatLock = toggleChatLock;
            vm.userClick = userClick;

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
                vm.globalMessages.push({
                    user: sock.user.name || sock.user.nickname,
                    message: "Has Connected!",
                    info: true,
                    date: new Date()
                });
                setUsers(sock.users);
            };

            function onDisconnection(sock) {
                vm.globalMessages.push({
                    user: sock.user.name || sock.user.nickname,
                    message: "Has Disconnected...",
                    info: true,
                    date: new Date()
                });
                setUsers(sock.users);
            }

            function setUsers(users) {
                // TODO: Figure out what to do with self as an online user
                var id = store.get('profile').user_id;
                var accounted = false;
                users.forEach(function(user, index, object) {
                    if (user.user_id == id) {
                        if (!accounted) {
                            accounted = true;
                        } else { // If we have an accounted user already in the list do not add a duplicate
                            object.splice(index, 1);
                        }                        
                    }
                });
                vm.users = users;
            }
            
            // Recieved Chat Message
            function onChatMessage(msg) {
                vm.globalMessages.push(msg);
                scrollToMessage();
                $rootScope.$emit('chatMessage');
                if (!store.get('chat::open') && (!store.get('profile').name || store.get('profile').nickname
                    != msg.user)) {
                    toastr.info(msg.message, 'New Message From: ' + msg.user);
                }
            };

            // Broadcast the chat lock functionality
            function toggleChatLock() {
                vm.isChatLocked = !vm.isChatLocked;
                store.set('chat::lock', vm.isChatLocked);
                $rootScope.$emit('chat::lock', vm.isChatLocked);
            }

            // Opens direct channel to user
            // TODO: Open direct channel to user for private conversations
            function userClick(user) {
                if (store.get('profile').user_id == user.user_id) {
                    return;
                }
                logger.info('[TEST] Messaging ' + (user.name || user.nickname));
            };

            function scrollToMessage() {
                // Animated scroll into view
                $('.chatarea').stop().animate({
                    scrollTop: $('.chatarea')[0].scrollHeight
                }, 1000);
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