"use strict";

var Path = require("path");
var Lodash = require("lodash");
var ImportCache = require("./import_cache");
var FileUtils = require("./file_utils");
var ImportPathFragmentBuilder = require("./import_path_fragment_builder");

var ImportPathFinder = function(searchPaths) {
	this.searchPaths = Lodash.flatten([ searchPaths || [] ]);
	this.pathStack = new ImportCache();
}

ImportPathFinder.prototype = {
	findPathFor: function(request) {
		this.pathStack.moveTo(request.previous);
		var requestedImport = request.current;
		var resolvedPath = this.findImportableFile(requestedImport);
		this.pathStack.add({ requested: requestedImport,
			resolved: resolvedPath });
		return resolvedPath;
	},

	findImportableFile: function(requestedImport) {
		var fragment = ImportPathFragmentBuilder.build(requestedImport);
		return this.findFirstMatchingPath(fragment);
	},

	findFirstMatchingPath: function(requestedImport) {
		var potentialPaths = [ this.pathStack.getCurrent() ]
			.concat(this.searchPaths);

	    for(var index = 0, length = potentialPaths.length; index < length; index++) {
	    	var path = potentialPaths[index];
			var resolvedPath = Path.join(path, requestedImport);

			if(FileUtils.isFile(resolvedPath)) {
				return resolvedPath;
			}
	    }

	    console.log("Unable to find import " + requestedImport + " in any of: "
	    	+ potentialPaths.join(", "));

	    throw("Unable to find import " + requestedImport + " in any of: "
	    	+ potentialPaths.join(", "));
	}
}

module.exports = ImportPathFinder;
