(function() {
    angular.module('app.widgets')
    .factory('Chat', ChatService);

    ChatService.$inject = ['$resource'];
    /* @ngInject */
    function ChatService($resource) {
        return $resource('/api/chat');
    }

})();