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
        controller.$inject = ['socket', 'toastr', 'moment', '$interval', '$anchorScroll'];
        function controller(socket, toastr, $interval, $anchorScroll) {
            var vm = this;
            vm.title = "Chat";
            vm.textInput = "";
            vm.messages = [];
            vm.sendMessage = sendMessage;
            vm.isConnected = isConnected;
            vm.connect = connect;
            vm.disconnect = disconnect;
            
            
            function connect() {
                socket.connect();

                socket.on('chatconnection::success', onConnectionSuccess);
                socket.on('chat::message', onChatMessage);
                socket.on('chat::disconnect', onDisconnection);

            }

            function disconnect() {
                socket.disconnect();
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
            };

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