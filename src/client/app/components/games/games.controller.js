(function() {
    angular.module('app.games')
    .controller('GamesController', GamesController);
    
    GamesController.$inject = ['store'];
    /* @ngInject */
    function GamesController(store) {
        var vm = this;
    }    
})();