(function() {
    angular.module('app.settings')
    .controller('SettingsController', SettingsController);
    
    SettingsController.$inject = ['store'];
    /* @ngInject */
    function SettingsController(store) {
        var vm = this;
    }    
})();