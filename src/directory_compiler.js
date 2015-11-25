"use strict";

var Path = require("path")
var Lodash = require("lodash");
var Q = require("q");
var FileUtils = require("./file_utils");

var DirectoryCompiler = function(options) {
	this.fileUtils = options.fileUtils || FileUtils;
	this.sassCompiler = options.sassCompiler;
};

DirectoryCompiler.prototype = {
	compile: function(sourcePath, destinationPath, done) {
		var sourceFileList = this.fileUtils.findAllSassFilesIn(sourcePath);
		var promises = [];

		var iterator = function(sourceFile) {
			var destinationFile = this.destinationFileNameFor(destinationPath,
				sourceFile);
			var deferred = Q.defer();
			promises.push(deferred.promise);
			this.sassCompiler.compile(sourceFile, destinationFile, deferred.resolve);
		}

		Lodash.each(sourceFileList, iterator.bind(this));

		Q.all(promises).then(done);
	},

	destinationFileNameFor: function(destinationPath, sourceFile) {
		var filename = Path.basename(sourceFile, ".scss");
		return Path.normalize(Path.join(destinationPath, filename + ".css"));
	}
}

module.exports = DirectoryCompiler;