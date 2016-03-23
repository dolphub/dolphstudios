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
            templateUrl: 'app/widgets/chat/directives/message/message.html'
        };

        function controller() {
            var vm = this;
            vm.getTime = getTime;
            
            function getTime() {
                return moment.utc(vm.data.date).fromNow();
            }
        }
        return directive;
    }
})();