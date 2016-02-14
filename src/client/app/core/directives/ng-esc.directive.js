(function() {
    angular.module('app.core')
    .directive('ngEsc', ngEsc);
    
    function ngEsc() {
        return function(scope, element, attrs) {
            element.bind("keyup", function(event) {
                if(event.which === 27) {
                    scope.$eval(attrs.ngEsc, {'event': event});
                    event.preventDefault();
                }
            });
        };
    }    
})();