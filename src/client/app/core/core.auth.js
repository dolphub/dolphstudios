(function() {
    'use strict';

    angular
        .module('app.core')
        .config(appConfig)
        .run(appRun);
        
    /* @ngInject */
    appConfig.$inject = ['authProvider', '$httpProvider','jwtInterceptorProvider'];
    function appConfig(authProvider, $httpProvider,jwtInterceptorProvider) {
        authProvider.init({
            domain: 'dolphstudio.auth0.com',
            clientID: 'GZARblcahIqPYgJZmJo5dom3IJ67OlbX',
            loginUrl: '/login'
        });
        
        jwtInterceptorProvider.tokenGetter = function(store) {
            return store.get('token');
        };
        $httpProvider.interceptors.push('jwtInterceptor');
    }
    
    /* @ngInject */
    appRun.$inject = ['$rootScope', 'auth', 'store', 'jwtHelper', '$location'];
    function appRun($rootScope, auth, store, jwtHelper, $location) {
        $rootScope.$on('$locationChangeStart', function() {
            if (!auth.isAuthenticated) {
                var token = store.get('token');
                if (token && !jwtHelper.isTokenExpired(token)) {
                    auth.authenticate(store.get('profile'), token);
                } else {
                    $location.path('/login');
                }
            }
        });
    }
})();