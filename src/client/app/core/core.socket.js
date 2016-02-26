(function() {
    angular.module('app.core')
    .factory('socket', socket);
    
    socket.$inject = ['$rootScope', 'store', 'toastr'];
    function socket($rootScope, store, toastr) {
        var socket;
        function connect() {
            socket = io.connect({
                'query': 'token=' + store.get('token'),
                'forceNew': true
            });

            socket.on('connect_failed', connectFailure);
            socket.on('disconnect', disconnected);

            function connectFailure() {
                toastr.warning('Failed to connect to the chat server...', 'Chat Connection');
            }

            function disconnected() {
                toastr.warning('You have been disconnected...', 'Chat');
            }
        }         

        function disconnect() {
            socket.removeAllListeners();
            socket.disconnect();
            socket = null;
        }

        return {
            connect: connect,
            disconnect: disconnect,
            on: function(evnt, callback) {
                if(socket._callbacks.hasOwnProperty('$' + evnt)) {
                    console.warn('Attempting to bind event that already exists...', evnt);
                    return;
                }
                socket.on(evnt, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(evnt, data, callback) {
                socket.emit(evnt, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            },
            connected: function() {
                return socket ? socket.connected : false;
            }
        }
    }
})();