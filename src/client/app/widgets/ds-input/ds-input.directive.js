(function () {
    angular.module('app.widgets')
    .directive('dsInput', DSInput);

    DSInput.$inject = ['$timeout'];
    function DSInput($timeout) {
        var directive = {
            bindToController: true,
            controller: controller,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                'model': '=?dsModel',
                'enter': '=?dsEnter',
                'disabled': '=?dsDisabled',
                'placeholder': '@dsPlaceholder'
            },
            link: link,
            templateUrl: 'app/widgets/ds-input/ds-input.html'
        };
        return directive;

        function controller() {
            var vm = this;
            vm.clearModel = clearModel;

            // TODO:  Move functionality outside of directive
            function clearModel() {
                $timeout(function() {
                    vm.model = "";
                }, 0);
            }
        }

        function link(scope, element, attributes) {
            // TODO:  Bind the extra attributes to the input field
        }
        
    }



})();