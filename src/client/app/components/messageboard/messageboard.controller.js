(function() {
    angular.module('app.messageboard')
    .controller('MessageboardController', MessageboardController);
    
    MessageboardController.$inject = ['store'];
    /* @ngInject */
    function MessageboardController(store) {
        var vm = this;
    }    
})();