(function() {
	angular.module('app.widgets')
	.controller('chatGlobalController', chatGlobalController);

	chatGlobalController.$inject = ['$rootScope', 'socket', 'store'];
	function chatGlobalController($rootScope, socket, store) {
		var vm = this;
		vm.messages = [];
		vm.textInput = "";

		vm.partialLoaded = partialLoaded;
		vm.sendMessage = sendMessage;

		socket.on('chat::global:message', onGlobalMessage);
		$rootScope.$on('chat::connection:statusChange', connectionStatus);

        function onGlobalMessage(msg) {
            vm.messages.push(msg);
            scrollToMessage();
            $rootScope.$emit('chatMessage');
            if (!store.get('chat::open') && (!store.get('profile').name || 
            	store.get('profile').nickname != msg.user)) {
                toastr.info(msg.message, 'New Message From: ' + msg.user);
            }
        };

        function connectionStatus(evnt, data) {
        	vm.messages.push(data);
        }

        function sendMessage() {
            if  (vm.textInput.length > 0) {
                socket.emit('chat::global:message', { msg: vm.textInput });
                vm.textInput = "";
            }
        }

		/**
		 * Gain access to parent controller directly from partial
		 */
		function partialLoaded(parentVM) {
			vm.super = vm;
		}

		function scrollToMessage() {
            // Animated scroll into view
            $('.chatarea').stop().animate({
                scrollTop: $('.chatarea')[0].scrollHeight
            }, 1000);
        }
	}
})();