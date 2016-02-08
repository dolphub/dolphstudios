(function() {
    angular.module('app.core')
    .service('guid', service);
    
    
    function service() {
        var service = {
            gen: _guid
        }
        return service;
        
        function _guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
    }
})();