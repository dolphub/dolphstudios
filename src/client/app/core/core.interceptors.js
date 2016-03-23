(function() {
    angular.module('app.core')
    .factory('apiInterceptor', apiInterceptor);

    apiInterceptor.$inject = ['$rootScope'];
    function apiInterceptor($rootScope) {

        var interceptor = {
            request: request,
            responseError: responseError
        };
        return interceptor;

        function request(config) {
            return config;
        }

        function responseError(response) {
            if (response.status === 401) {
                $rootScope.$emit('unauthorized');
            }
            return response;
        }
    }
})();