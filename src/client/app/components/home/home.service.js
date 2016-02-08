(function() {
    angular.module('app.home')
    .factory('homeservice', dataservice);
    
    dataservice.$inject = ['logger', '$http'];
    /* @ngInject */
    function dataservice(logger, $http) {
        var service = {
            getUser: getUser
        }
        return service;
                
        function getUser() {
            return $http.get('/api/user')
                .then(success)
                .catch(fail);
                
            function success(response) {
                return response.data;   
            }            
            function fail(e) {
                throw new Error(e);
            }
        }
    }
})();