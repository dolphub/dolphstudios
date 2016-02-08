(function() {
    angular.module('app.widgets')
    .directive('commentSectionCard', Comment);
    
    Comment.$inject = [];
    function Comment() {
        var directive = {
            bindToController: true,
            controller: controller,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                'comments': '=comments',
                'title': '@csTitle'
            },
            templateUrl: 'app/widgets/comments/comment-section-card.html'
        };        
        
        /* @ngInject */
        function controller() {
            var vm = this;
        }   
        return directive;
    }
})();