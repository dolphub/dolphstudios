(function() {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['config', 'auth', '$location', 'store'];
    function LoginController(config, auth, $location, store) {
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
