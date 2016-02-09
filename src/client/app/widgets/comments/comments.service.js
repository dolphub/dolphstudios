(function() {
    angular.module('app.widgets')
    .factory('Comments', commentservice);

    commentservice.$inject = ['$resource'];
    /* @ngInject */
    function commentservice($resource) {
        return $resource('/api/comments', {}, {
            add: {
                method: 'PUT'
            }
        });


    //     return {
    //         getComments: getComments,
    //         addComment: addComment  
    //     };

    //     function getComments() {
    //         return $http.get('/api/comments')
    //             .then(success)
    //             .catch(fail);
                
    //         function success(response) {
    //             return response.data;
    //         }            
    //         function fail(e) {
    //             throw new Error(e);
    //         }
    //     }

    //     function addComment(comment) {
    //         $http.post('/api/comments', {
    //             theDATA: comment
    //         }).then(success)
    //         .catch(fail);

    //         function success(response) {
    //             return response.data;
    //         }            
    //         function fail(e) {
    //             throw new Error(e);
    //         }
    //     }
    }

})();