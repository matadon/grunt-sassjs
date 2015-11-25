'use strict';

var DirectoryCompiler = require('../src/directory_compiler');
var SassCompiler = require('../src/sass_compiler');
var Logger = require('../src/logger');

var SassJsTask = function(grunt) {
  var description = 'Grunt task for SASS compilation using Sass.js';
  grunt.registerMultiTask('sassjs', description, function () {
    var options = this.options();
    var logger = new Logger(grunt);
    var done = this.async();

    var sassCompilerOptions = {
      importPath: options.importPath,
      logger: logger
    }

    var sassCompiler = new SassCompiler(sassCompilerOptions);

    var directoryCompilerOptions = {
      sassCompiler: sassCompiler,
      logger: logger
    }

    var directoryCompiler = new DirectoryCompiler(directoryCompilerOptions);

    logger.logExceptions(function() {
      directoryCompiler.compile(options.sourcePath, options.destinationPath, done);
    });
  });
};

module.exports = SassJsTask;