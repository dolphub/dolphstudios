(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('LandingController', LandingController);

    LandingController.$inject = ['config', 'auth', '$location', 'store'];
    /* @ngInject */
    function LandingController(config, auth, $location, store) {
        var vm = this;
        vm.config = config;
        vm.login = authSignin;
        
        function authSignin() {
            auth.signin({
                authParams: {
                    scope: config.login.authParams 
                }
            }, function(profile, idToken, accessToken, state, refreshToken) {                
                store.set('profile', profile);
                store.set('token', idToken);
                $location.path('/');
            }, function(err) {
                console.log("Error :(", err);
            });
        };
    }
})();
