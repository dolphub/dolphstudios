(function() {
	angular.module('app.widgets')
	.controller('chatMessagesController', chatMessagesController);

	chatMessagesController.$inject = [];
	function chatMessagesController() {
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