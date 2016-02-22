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
            templateUrl: 'app/widgets/comments/comment-section.html'
        };  
        return directive;      
        
        controller.$inject = ['store', '$http', 'Comments', '$timeout'];
        /* @ngInject */
        function controller(store, $http, Comments, $timeout) {
            var vm = this;
            var profile = store.get('profile');
            vm.promise = null;
            vm.comments = [];
            vm.maxLoadComments = 8;
            
            // Methods
            vm.loadMore = loadMore;
            vm.postMessage = postMessage;
            vm.getComments = getComments;
            vm.getComments();

            /**
             * Load next stack of posts through infinite scroll.
             */
            function loadMore() {
                // If we have a promise pending, do not call another
                if (vm.promise.$$state.status == 0) {
                    return;
                }

                vm.promise = Comments.query({
                    skipCount: vm.comments.length,
                    maxComments: vm.maxLoadComments
                }).$promise;

                vm.promise.then(function(data) {
                    if (data.constructor === Array) {
                        data.forEach(function(c) { vm.comments.push(c); });
                    } else {
                        vm.comments.push(data);
                    }
                });
            }

            /**
             * Post message to server.
             */
            function postMessage() {
                if (!vm.messageText) {
                    return;
                }
                var commentObj = new Comments({
                    user: profile.name || profile.nickname,
                    avatar: profile.picture,
                    message: vm.messageText,
                    date: new Date(new Date().toISOString())
                });

                commentObj.$save(function(data) {
                    console.log(data);
                    vm.messageText = "";
                    getComments();
                });
            }

            /**
             * Get initial comments.
             */
            function getComments() {
                vm.promise = Comments.query({ maxComments: vm.maxLoadComments }).$promise;
                vm.promise.then(function(data) {
                    vm.comments = data;
                });
            }
        }        
    }
})();