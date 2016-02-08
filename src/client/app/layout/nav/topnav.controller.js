(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('TopNavController', topNavController);

        
    topNavController.$inject = ['$scope', 'auth', 'store', 
        '$state', 'toastr', '$window', 'config'];
    /* @ngInject */
    function topNavController($scope, auth, store, $state, toastr, $window, config) {
        var vm = this;
        vm.scope = $scope;
        vm.profile = store.get('profile');
        vm.logout = logout;
        vm.toggleLeftBar = toggleLeftBar;
        vm.toggleRightChat = toggleRightChat;
        vm.isLeftToggled = true;
        vm.isRightToggled = true;
        
        function logout() {
            auth.signout();
            store.remove('profile');
            store.remove('token');
            $state.go('home');
        }
        
        function toggleLeftBar() {
            $('#sidebar').toggleClass('open');
            $('#main-section').toggleClass('main-content');
            // chat-active
            vm.isLeftToggled = !vm.isLeftToggled;
        }  
        
       function toggleRightChat() {
            $('#chatbar').toggleClass('open');
            $('#main-section').toggleClass('chat-active');
            // chat-active
            vm.isRightToggled = !vm.isRightToggled;
        }
    }
})();
