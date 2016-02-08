(function() {
    angular.module('app.home')
    .controller('HomeController', HomeController);
    
    HomeController.$inject = ['store', 'homeservice'];
    /* @ngInject */
    function HomeController(store, homeservice) {
        var vm = this;
        var profile = store.get('profile');        
        vm.theItems = [
            { user: profile.name || profile.nickname, avatar: profile.picture, message: 'Where\'s the games noob?', date: 'commented 54 minutes ago' },
            { user: profile.name || profile.nickname, avatar: profile.picture, message: 'Wow this material design is pretty nifty!', date: 'commented 2 days ago' },
            { user: profile.name || profile.nickname, avatar: profile.picture, message: 'This site is awesome!', date: 'commented 4 days ago' }
        ]; 
        
        // Methods
        vm.callApi = callApi;
        
        function callApi() {
            homeservice.getUser().then(function(res) {
                console.log(res);
            });
        } 
    }    
})();