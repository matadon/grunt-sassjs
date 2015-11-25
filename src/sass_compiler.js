"use strict";

var Sass = require("sass.js");
var FileUtils = require("./file_utils");
var ImportResolver = require("./import_resolver");

var SassCompiler = function(options) {
  this.fileUtils = options.fileUtils || FileUtils;
  this.logger = options.logger;

  var resolver = new ImportResolver(options);
  Sass.importer(resolver.resolve.bind(resolver));
};

SassCompiler.prototype = {
  compile: function(sourcePath, destinationPath, done) {
    var afterCompile = function (result) {
    	if(result.status == 0) {
        this.handleCompileSuccess(result, destinationPath);
    	} else {
        this.handleCompileError(result, sourcePath);
      }
  	  done();
    }

    var sourceContent = this.fileUtils.readFile(sourcePath);
    Sass.options({ inputPath: sourcePath });
    Sass.compile(sourceContent, {}, afterCompile.bind(this));
  },

  handleCompileSuccess: function(result, destinationPath) {
    this.fileUtils.writeFile(destinationPath, result.text);
  },

  handleCompileError: function(result, sourcePath) {
    var line = result.line;
    var column = result.column;
    var file = result.file;
    var message = result.message;

    if(file === "stdin") { file = sourcePath; }

    this.logger.error(result.message + " (Line " + line + " column " + column
      + " in " + file + ")");
  }
}

module.exports = SassCompiler;