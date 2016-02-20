(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('TopNavController', topNavController);

        
    topNavController.$inject = ['$rootScope', 'auth', 'store', 
        '$state', 'toastr', '$window', 'config'];
    /* @ngInject */
    function topNavController($rootScope, auth, store, $state, toastr, $window, config) {
        var vm = this;
        vm.rootScope = $rootScope;
        vm.profile = store.get('profile');
        vm.logout = logout;
        vm.toggleLeftBar = toggleLeftBar;
        vm.toggleChat = toggleChat;
        vm.isLeftToggled = true;
        vm.isChatToggled = false;
        vm.unreadMessages = 0;
        onStart();

        
        function logout() {
            auth.signout();
            store.remove('profile');
            store.remove('token');
            $state.go('home');
        }
        
        function toggleLeftBar() {
            $('#sidebar').toggleClass('open');
            $('#main-section').toggleClass('main-content');
            vm.isLeftToggled = !vm.isLeftToggled;
        }  
        
        function toggleChat(open) {
            $('#chatbar').toggleClass('open');
            $('#main-section').toggleClass('chat-active');
            vm.isChatToggled = !vm.isChatToggled;
            vm.unreadMessages = 0;

            // Save the state of the chat
            store.set('chat::open', vm.isChatToggled);
        }

        function openChat() {
            if (!vm.isChatToggled) {
                toggleChat();
            }
        }

        function closeChat() {
            if (vm.isChatToggled) {
                toggleChat();
            }
        }

        $rootScope.$on('chatMessage', function() {
            if (!vm.isChatToggled) {
                vm.unreadMessages++;
            }
        });

        function onStart() {
            if (store.get('chat::open')) {
                openChat();
            } else {
                closeChat();
            }
        };
    }
})();
