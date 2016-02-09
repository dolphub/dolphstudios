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
                'title': '@csTitle'
            },
            templateUrl: 'app/widgets/comments/comment-section-card.html'
        };  
        return directive;      
        
        controller.$inject = ['store', '$http', 'Comments'];
        /* @ngInject */
        function controller(store, $http, Comments) {
            var vm = this;
            var profile = store.get('profile');
            vm.comments = [];
            vm.getComments = getComments;
            vm.getComments();

            // Methods
            vm.postMessage = postMessage;

            // Post Message
            function postMessage() {
                var commentObj = new Comments({
                    user: profile.name || profile.nickname, 
                    avatar: profile.picture,
                    message: vm.messageText,
                    date: new Date(new Date().toISOString())
                });

                commentObj.$save(function(data) {
                    console.log(data);
                });
                

                vm.comments.push(commentObj);
                vm.messageText = "";

                
            }

            function getComments() {
                vm.comments = Comments.query();
            }

        }        
    }
})();