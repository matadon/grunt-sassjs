"use strict";

var Fs = require("fs");
var Path = require("path");
var Mkdirp = require("mkdirp");
var Glob = require("glob");
var Lodash = require("lodash");

var FileUtils = {
	isFile: function(file) {
		try {
			var stat = Fs.statSync(file)
			return stat.isFile();
		} catch (exception) {
			if (exception.code === 'ENOENT') {
				return false;
			} else {
			    throw exception;
			}
		}
	},

	readFile: function(path) {
		return Fs.readFileSync(path).toString();
	},

	writeFile: function(path, content) {
		Mkdirp.sync(Path.dirname(path));
		Fs.writeFileSync(path, content);
	},

	findAllSassFilesIn: function(path) {
		var allFiles = Glob.sync(Path.join(path, "*.scss"));
		return Lodash.reject(allFiles, function(file) {
			return Path.basename(file).match(/^_/);
		});
	}
}

module.exports = FileUtils;