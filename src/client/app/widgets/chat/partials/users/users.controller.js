(function() {
	angular.module('app.widgets')
	.controller('chatUsersController', chatUsersController);

	chatUsersController.$inject = [];
	/* @ngInject */
	function chatUsersController() {
		var vm = this;
		vm.partialLoaded = partialLoaded;

		/**
		 * Gain access to parent controller directly from partial
		 */
		function partialLoaded(parentVM) {
			vm.super = vm;
		}
	}
})();