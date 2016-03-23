(function() {
    angular.module('app.messageboard')
    .controller('MessageboardController', MessageboardController);
    
    MessageboardController.$inject = ['store'];
    function MessageboardController(store) {
        var vm = this;
    }    
})();