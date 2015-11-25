'use strict';

var Fs = require("fs");
var ImportPathFinder = require("./import_path_finder");

var ImportResolver = function(options) {
	options = options || {};
	this.fs = options.fs || Fs;
	this.pathFinder = new ImportPathFinder(options.importPath);
};

ImportResolver.prototype = {
	resolve: function(request, done) {
		var contentPath = this.pathFinder.findPathFor(request);
	    var content = this.fs.readFileSync(contentPath).toString();
		var result = { path: contentPath, content: content };
		done(result);
	}
}

module.exports = ImportResolver;