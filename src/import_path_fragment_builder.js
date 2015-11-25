"use strict";

var Path = require("path");

var ImportPathFragmentBuilder = {
	build: function(requestedImport) {
		var dirname = Path.dirname(requestedImport);
		var basename = Path.basename(requestedImport);
		return Path.join(dirname, this.addExtension(this.addPrefix(basename)));
	},

	addExtension: function(filename) {
	    if (filename.match(/\.scss$/)) {
	    	return filename;
	    } else {
	    	return filename + ".scss";
	    }
	},

	addPrefix: function(filename) {
	    if (filename.match(/^_/)) {
	    	return filename;
	    } else {
	    	return "_" + filename;
	    }
	}
}

module.exports = ImportPathFragmentBuilder;