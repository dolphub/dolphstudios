(function() {
    angular.module('app.core')
    .directive('ngEnter', ngEnter);
    
    function ngEnter() {
        return function(scope, element, attrs) {
            element.bind("keypress", function(event) {
                if(event.which === 13) {
                    scope.$eval(attrs.ngEnter, {'event': event});
                    event.preventDefault();
                }
            });
        };
    }    
})();