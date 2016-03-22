(function() {
    'use strict';

    angular
        .module('app.core')
        .config(appConfig)
        .run(appRun);
    
    appConfig.$inject = ['authProvider', '$httpProvider','jwtInterceptorProvider'];
    /* @ngInject */
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
        $httpProvider.interceptors.push('apiInterceptor');
    }
    
    /* @ngInject */
    appRun.$inject = ['$rootScope', 'logger', 'auth', 'store', 'jwtHelper', '$location'];
    function appRun($rootScope, logger, auth, store, jwtHelper, $location) {
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

        $rootScope.$on('unauthorized', unauthorized);
        function unauthorized() {
            if (!auth.isAuthenticated) { // Disregard if we are already unauthenticated
                return;
            }

            logger.error('It appears your token is invalid.  Please log in.', null, 'Unauthorized');
            store.remove('profile');
            store.remove('token');
            auth.signout();
            $location.path('/');
        };
    }

    /* @ngInject */
    interceptor.$inject = [];
    function interceptor() {

    }
})();