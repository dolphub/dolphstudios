(function() {
    angular.module('app.messageboard')
    .run(appRun);
    
    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }
    
    function getStates() {
        return [
            {
                state: 'messageboard',
                config: {
                    url: '/messageboard',
                    templateUrl: 'app/components/messageboard/messageboard.html',
                    controller: 'MessageboardController',
                    controllerAs: 'vm',
                    title: 'Messageboard',
                    settings: {
                        nav: 4,
                        content: '<i class="fa fa-envelope-o"></i> Messageboard'
                    }
                }
            }
        ];
    }
})();