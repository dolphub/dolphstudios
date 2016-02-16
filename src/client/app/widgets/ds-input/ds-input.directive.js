(function () {
    angular.module('app.widgets')
    .directive('dsInput', DSInput);

    DSInput.$inject = ['$timeout'];
    /* @ngInject */
    function DSInput($timeout) {
        var directive = {
            bindToController: true,
            controller: controller,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                'model': '=?model',
                'placeholder': '@placeholder'
            },
            templateUrl: 'app/widgets/ds-input/ds-input.html'
        };
        return directive;

        function controller() {
            var vm = this;
            vm.clearModel = clearModel;

            function clearModel() {
                $timeout(function() {
                    vm.model = "";    
                }, 0);
            }
        }
        
    }



})();