(function() {
    angular.module('app.settings')
    .controller('SettingsController', SettingsController);
    
    SettingsController.$inject = ['store'];
    function SettingsController(store) {
        var vm = this;
    }    
})();