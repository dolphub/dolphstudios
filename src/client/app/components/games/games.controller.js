(function() {
    angular.module('app.games')
    .controller('GamesController', GamesController);
    
    GamesController.$inject = ['store'];
    function GamesController(store) {
        var vm = this;
    }    
})();