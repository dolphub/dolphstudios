(function() {
    angular.module('app.widgets')
    .directive('message', Message);
    
    Message.$inject = [];
    function Message() {
        var directive = {
            bindToController: true,
            controller: controller,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                'data': '='
            },
            templateUrl: 'app/widgets/chat/message.html'    
        };
        
        /* @ngInject */
        function controller() {
            var vm = this;
            vm.getTime = getTime;
            
            function getTime() {
                return moment(vm.data.date).fromNow();
            }
        }
        return directive;
    }
})();