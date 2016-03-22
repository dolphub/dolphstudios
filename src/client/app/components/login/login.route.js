(function() {
    angular.module('app.home')
    .run(appRun);
    
    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        var otherwise = 'home';
        routerHelper.configureStates(getStates(), otherwise);
    }
    
    function getStates() {
        return [
            {
                state: 'login',
                config: {
                    url: '/login',
                    templateUrl: 'app/components/login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    title: 'Login'
                }
            }
        ];
    }
})();