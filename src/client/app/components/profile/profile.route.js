(function() {
    angular.module('app.profile')
    .run(appRun);
    
    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }
    
    function getStates() {
        return [
            {
                state: 'profile',
                config: {
                    url: '/profile',
                    templateUrl: 'app/components/profile/profile.html',
                    controller: 'ProfileController',
                    controllerAs: 'vm',
                    title: 'Profile'
                }   
            }
        ];
    }
})();