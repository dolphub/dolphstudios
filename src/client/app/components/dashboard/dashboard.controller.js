(function() {
    angular.module('app.dashboard')
    .controller('DashboardController', DashboardController);
    
    DashboardController.$inject = ['store'];
    /* @ngInject */
    function DashboardController(store) {
        var vm = this;
    }    
})();