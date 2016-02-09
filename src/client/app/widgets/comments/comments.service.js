(function() {
    angular.module('app.widgets')
    .factory('Comments', commentservice);

    commentservice.$inject = ['$resource'];
    /* @ngInject */
    function commentservice($resource) {
        return $resource('/api/comments');
    }

})();