(function() {
    angular.module('app.widgets')
    .factory('Comments', commentService);

    commentService.$inject = ['$resource'];
    /* @ngInject */
    function commentService($resource) {
        return $resource('/api/comments');
    }

})();