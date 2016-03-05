(function() {
    angular.module('app.core')
    .factory('socket', socket);
    
    socket.$inject = ['$rootScope', 'store', 'toastr'];
    function socket($rootScope, store, toastr) {
        var socket;
        
        var socketFactory = {
            connect: connect,
            disconnect: disconnect,
            on: onHandle,
            emit: emitHandle,
            connected: connected
        }
        return socketFactory;

        /**
         * Connect to the socket server with jwt token.
         */
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

        /**
         * Disconnect socket from server, clear all listers and remove instance.
         */
        function disconnect() {
            socket.removeAllListeners();
            socket.disconnect();
            socket = null;
        }

        /**
         * Socket event definitions.
         * @param {String} Event name to bind on.
         * @param {function} Function callback.
         */
        function onHandle(evnt, callback) {
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
        }

        /**
         * Emit event definition
         * @param Event name to bind.
         * @param {Object} Data payload to send.
         * @param {Function} Event Callback
         */
        function emitHandle(evnt, data, callback) {
           socket.emit(evnt, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }

        /**
         * Checks if our socket is connected.
         * @returns {Boolean}
         */
        function connected() {
            return socket ? socket.connected : false;
        }


    }
})();