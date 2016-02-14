(function() {
    angular.module('app.widgets')
    .directive('commentCard', Comment);
    
    Comment.$inject = ['$timeout', 'moment'];
    function Comment($timeout, moment) {
        var directive = {
            bindToController: true,
            controller: controller,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                'comment': '='
            },
            templateUrl: 'app/widgets/comments/comment.html'
        };
        
        /* @ngInject */
        function controller() {
            var vm = this;
            vm.getTimestamp = getTimestamp
            
            function getTimestamp() {
                // New date moment performance hack
                return moment.utc(new Date(vm.comment.date)).fromNow();
            }
        }

        
        return directive;
    }
})();