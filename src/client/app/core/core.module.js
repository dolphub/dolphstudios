(function () {
    'use strict';

    angular
        .module('app.core', [
            'ngAnimate', 'ngSanitize',
            'auth0', 'angular-storage', 'angular-jwt', 'ngAnimate',
            'ngResource', 'cfp.hotkeys',
            'blocks.logger', 'blocks.router'
        ]);
})();