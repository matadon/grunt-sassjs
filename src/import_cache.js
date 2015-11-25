'use strict';

var Path = require("path");
var Lodash = require("lodash");
var FileUtils = require("./file_utils");

var ImportCache = function() {
	this.stack = [];
}

ImportCache.prototype = {
	add: function(item) {
		if (! Lodash.isEqual(Lodash.last(this.stack), item)) {
			this.stack.unshift(item);
		}
	},

	moveTo: function(path) {
		if (FileUtils.isFile(path)) {
			this.add({ requested: path, resolved: path });
		}

		this.currentPath = this.findInStack(path);
	},

    getCurrent: function() {
        return this.currentPath;
    },

	findInStack: function(path) {
		var item;
	
		for(var index = 0, length = this.stack.length; index < length; index++) {
			var item = this.stack[index]
			if(path == item.requested) {
				this.stack.push(item);
				return Path.dirname(item.resolved);
			}
		}

		throw("Unable to find in resolved path cache: " + path);
	}
}

module.exports = ImportCache;
