(function() {
    angular.module('app.home')
    .run(appRun);
    
    /* @ngInject */
    appRun.$inject = ['routerHelper'];
    function appRun(routerHelper) {
        var otherwise = 'home';
        routerHelper.configureStates(getStates(), otherwise);
    }
    
    function getStates() {
        return [
            {
                state: 'home',
                config: {
                    url: '/home',
                    templateUrl: 'app/components/home/home.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    title: 'Home',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-home"></i> Home'
                    }
                }
            }
        ];
    }
})();


/*
(function() {
    angular.module('app.home')
    .run(appRun);
    
    
    appRun.$inject = ['$statePrider', '$urlRouterProvider'];
    function appRun($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/home/home.html'
            });
    }
    
    // function getStates() {
    //     return [
    //         {
    //             state: 'home',
    //             config: {
    //                 url: '/',
    //                 templateUrl: 'app/home/home.html',
    //                 controller: 'HomeController',
    //                 controllerAs: 'vm',
    //                 title: 'Home',
    //                 settings: {
    //                     nav: 1,
    //                     content: '<i class="fa fa-dashboard"></i> Dashboard'
    //                 }
    //             }   
    //         }
    //     ];
    // }
})();*/