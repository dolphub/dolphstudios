(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('TopNavController', topNavController);

        
    topNavController.$inject = ['$rootScope', '$timeout', 'auth', 'store', 
        '$state', 'toastr', '$window', 'config'];
    /* @ngInject */
    function topNavController($rootScope, $timeout, auth, store, $state, toastr, $window, config) {
        var vm = this;
        vm.rootScope = $rootScope;
        vm.profile = store.get('profile');
        vm.logout = logout;
        vm.toggleLeftBar = toggleLeftBar;
        vm.toggleChat = toggleChat;
        vm.overlayClick = overlayClick;
        vm.isLeftToggled = true;
        vm.isChatToggled = false;
        vm.isChatLocked = false;
        vm.unreadMessages = 0;

        if (store.get('chat::open') && store.get('chat::lock')) {
            openChat();
        }

        if (store.get('chat::lock') !== null) {
            vm.isChatLocked = store.get('chat::lock');
            onChatLock(null, vm.isChatLocked);
        }

        $rootScope.$on('chat::lock', onChatLock);
        $rootScope.$on('chat::close', function() { closeChat(); });
        $rootScope.$on('chat::open', function() { openChat(); });
        $rootScope.$on('chat::toggle', function() { toggleChat(); });
        $rootScope.$on('chatMessage', function() {
            if (!vm.isChatToggled) {
                vm.unreadMessages++;
            }
        });

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
        
        function toggleChat() {
            vm.unreadMessages = 0;
            $('#chatbar').toggleClass('open');
            vm.isChatToggled = !vm.isChatToggled;
            store.set('chat::open', vm.isChatToggled);

            if (vm.isChatLocked) {
                if (vm.isChatToggled) {
                    $('#main-section').addClass('chat-active');    
                } else {
                    $('#main-section').removeClass('chat-active');
                }                
            } else {
                if (vm.isChatToggled) {
                    $('#overlay').addClass('overlay-show');                    
                } else {
                    $('#overlay').removeClass('overlay-show');
                }
            }

            if (vm.isChatToggled) {
                $timeout(function() {
                    $('#chatbar ds-input input:text').focus()
                }, 40);                
            }
        }

        function openChat(isLocked) {
            if (!vm.isChatToggled) {
                toggleChat();
            }
        }

        function closeChat(isLocked) {
            if (vm.isChatToggled) {
                toggleChat();
            }
        }

        function onChatLock(evnt, isLocked) {
            if (isLocked) {
                lockChat();
            } else {
                unlockChat();
            }
            vm.isChatLocked = isLocked;
        }

        function lockChat() {
            if (vm.isChatToggled) {
                $('#main-section').addClass('chat-active');
                $('#overlay').removeClass('overlay-show');
            } else {
                $('#main-section').removeClass('chat-active');
            }            
        }

        function unlockChat() {
            if (vm.isChatToggled) {
                $('#main-section').removeClass('chat-active');
                $('#overlay').addClass('overlay-show');
            }
        }
       

        function overlayClick() {
            closeChat();
        }
    }
})();
