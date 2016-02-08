/* global process */
 'use strict';
 var _ = require('lodash'),
 	glob = require('glob');

/**
 * Retrieves all files matching a path pattern
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
	var _this = this;
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
	var output = [];
	if( _.isArray(globPatterns) ) {
		globPatterns.forEach(function(glob) {
			output = _.union(output, _this.getGlobbedFiles(glob, removeRoot));
		});
	} else if( _.isString(globPatterns) ) { // Single glob entry
		if( urlRegex.test(globPatterns) ) {
			output.push(globPatterns);
		} else {
			var files = glob(globPatterns, { sync: true});
			output = _.union(output, files); // Insert files into output
		}				
	}
	
	return output;
};