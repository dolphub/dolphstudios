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
            templateUrl: 'app/widgets/comments/comment-card.html'
        };
        
        /* @ngInject */
        function controller() {
            var vm = this;
            vm.getTimestamp = getTimestamp
            
            function getTimestamp() {
                return moment.utc(vm.comment.date).fromNow();
            }
        }

        
        return directive;
    }
})();