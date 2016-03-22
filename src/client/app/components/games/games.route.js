(function() {
    angular.module('app.games')
    .run(appRun);
    
    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }
    
    function getStates() {
        return [
            {
                state: 'games',
                config: {
                    url: '/games',
                    templateUrl: 'app/components/games/games.html',
                    controller: 'GamesController',
                    controllerAs: 'vm',
                    title: 'Games',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-gamepad"></i> Games'
                    }
                }
            }
        ];
    }
})();