(function() {
    angular.module('app.profile')
    .controller('ProfileController', ProfileController);
    
    ProfileController.$inject = ['store'];
    /* @ngInject */
    function ProfileController(store) {
        var vm = this;
        vm.profile = store.get('profile');
    }
})();