(function() {
	angular.module('app.widgets')
	.controller('chatUsersController', chatUsersController);

	chatUsersController.$inject = ['$rootScope', 'store', 'logger', 'Chat'];
	function chatUsersController($rootScope, store, logger, Chat) {
		var vm = this;
		vm.users = [];

		vm.partialLoaded = partialLoaded;
		vm.userClick = userClick;

		$rootScope.$on('chat::users:update', updateUsers);
		$rootScope.$on('chat::users:view', getUsers);
		/**
		 * Gain access to parent controller directly from partial
		 */
		function partialLoaded(parentVM) {
			vm.super = vm;
		}

		// Opens direct channel to user
        // TODO: Open direct channel to user for private conversations
        function userClick(user) {
            if (store.get('profile').user_id == user.user_id) {
                return;
            }
            logger.info('[TEST] Messaging ' + (user.name || user.nickname));
        };

		function updateUsers(evnt, users) {
			var id = store.get('profile').user_id;
			var accounted = false;
			users.forEach(function(user, index, object) {
				if (user.user_id == id) {
					if (!accounted) {
						accounted = true;
					} else { // If we have an accounted user already in the list do not add a duplicate
						object.splice(index, 1);
					}
				}
			});
			vm.users = users;			
		}

		function getUsers(evnt) {
			Chat.query().$promise.then(function(users) {
				updateUsers(null, users);	
			});
			
		}
	}
})();