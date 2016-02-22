(function() {
    angular.module('app.core')
    .directive('dsSpinner', dsSpinner);


    function dsSpinner() {
        var directive = {
            restrict: 'EA',
            bindToController: true,
            controller: dsSpinnerController,
            controllerAs: 'vm',
            link: link,
            replace: true,
            translcude: true,
            scope: {
                'promise': '=?dsPromise'
            },
            template: '<span style="height: 75px;" ng-if="vm.showSpinner"><cube-grid-spinner></cube-grid-spinner></span>'
            // rotating-plane-spinner
            // double-bounce-spinner
            // wave-spinner
            // wandering-cubes-spinner
            // pulse-spinner
            // chasing-dots-spinner
            // circle-spinner
            // three-bounce-spinner
            // cube-grid-spinner
            // word-press-spinner
            // fading-circle-spinner
        };
        return directive;

        function dsSpinnerController() {
            var vm = this;
        }

        function link(scope, element, attrs) {
            scope.$watch(attrs.dsPromise, function(promise) {
                scope.vm.showSpinner = true;
                promise.then(function() {
                    scope.vm.showSpinner = false;
                }, function() {
                    scope.vm.showSpinner = false;
                });
            });
        }
    }
})();