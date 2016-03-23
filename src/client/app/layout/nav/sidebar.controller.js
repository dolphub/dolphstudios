(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['config', 'auth', 'store', '$state', 'routerHelper', 'socket']
    function SidebarController (config, auth, store, $state, routerHelper, socket) {
         var vm = this;
         
         vm.profile = store.get('profile');     
         vm.$state = $state;    
         vm.toggleState = toggleState;
         vm.logout = logout;
         
         var states = routerHelper.getStates();
         getNavRoutes();
         
         function toggleState() {
            vm.state = !vm.state;
         }
         
         function logout() {
            auth.signout();
            store.remove('profile');
            store.remove('token');
            $state.go('login');
         }
         
        function getNavRoutes() {
            vm.navRoutes = states.filter(function(r) {
                return r.settings && r.settings.nav;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function isCurrent(route) {
            if (!route.title || !$state.current || !$state.current.title) {
                return '';
            }
            var menuName = route.title;
            return $state.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }
    }
    
    // function sidebarDirective() {
    //     return {
    //         link : function(vm, element, attr) {
    //            vm.$watch(attr.sidebarDirective, function(newVal) {
    //                if (newVal) {
    //                    element.addClass('show');
    //                    return;
    //                }
    //                element.removeClass('show');
    //            });
    //         }
    //     }
    // }
    
})();
