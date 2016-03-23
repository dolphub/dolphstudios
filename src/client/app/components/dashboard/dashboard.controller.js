(function() {
    angular.module('app.dashboard')
    .controller('DashboardController', DashboardController);
    
    DashboardController.$inject = ['store'];
    function DashboardController(store) {
        var vm = this;
    }    
})();