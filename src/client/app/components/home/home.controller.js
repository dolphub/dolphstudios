(function() {
    angular.module('app.home')
    .controller('HomeController', HomeController);
    
    HomeController.$inject = ['store', 'homeService', '$rootScope'];
    function HomeController(store, homeService, $rootScope) {
        var vm = this;
        var profile = store.get('profile');        
        // Methods
        vm.callApi = callApi;
        
        function callApi() {
            homeService.getUser().then(function(res) {
                console.log(res);
            });
            // $rootScope.$emit('chat-msg');
        }


    }
})();