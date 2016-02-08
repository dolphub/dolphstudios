(function() {
    angular.module('app.widgets')
    .directive('commentCard', Comment);
    
    Comment.$inject = ['$timeout'];
    function Comment($timeout) {
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
        }   
        return directive;
    }
})();