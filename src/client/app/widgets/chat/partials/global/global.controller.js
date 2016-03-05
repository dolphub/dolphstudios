(function() {
	angular.module('app.widgets')
	.controller('chatGlobalController', chatGlobalController);

	chatGlobalController.$inject = [];
	/* @ngInject */
	function chatGlobalController() {
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