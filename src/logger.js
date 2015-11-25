"use strict";

var Logger = function(grunt) {
	this.grunt = grunt;
};

Logger.prototype.error = function(message) {
	this.grunt.fatal(message);
};

Logger.prototype.info = function(message) {
	this.grunt.ok(message);
};

Logger.prototype.logExceptions = function(callback) {
	try {
      callback();
    } catch(exception) {
   	  if(exception.trace) {
	      this.error(exception.trace());
   	  } else if(exception.stack) {
	      this.error(exception.stack());
   	  } else {
	      this.error(exception);
   	  }
    }
};

module.exports = Logger;