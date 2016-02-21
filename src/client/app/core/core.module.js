(function () {
    'use strict';

    angular
        .module('app.core', [
            'ngAnimate', 'ngSanitize',
            'auth0', 'angular-storage', 'angular-jwt', 'ngAnimate',
            'ngResource', 'cfp.hotkeys', 'angular-spinkit',
            'blocks.logger', 'blocks.router'
        ]);
})();1