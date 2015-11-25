'use strict';

var ImportResolver = require("../src/import_resolver");

describe("ImportResolver", function() {
	var resolver;

	var basePath = __dirname + "/fixtures/pathWalking";

	beforeEach(function() {
		resolver = new ImportResolver();
	});

	describe(".resolve", function() {
		it("resolve import file path", function(done) {
			var request = {
				current: 'subpathAlpha/alpha',
			  	previous: basePath + '/root.scss',
			  	resolved: basePath + '/subpathAlpha/alpha',
			  	path: null }

			resolver.resolve(request, function(result) {
				expect(result.path).toEqual(basePath + "/subpathAlpha/_alpha.scss");
				done();
			});
		});

		it("resolve nested imports", function(done) {
			var knownWorkingRequest = {
				current: 'subpathAlpha/alpha',
				previous: basePath + '/root.scss',
  				resolved: basePath + '/subpathAlpha/alpha',
				path: null };

			resolver.resolve(knownWorkingRequest, function() {			
				var request = {
					current: '../subpathBravo/bravo',
					previous: 'subpathAlpha/alpha',
					resolved: '/subpathBravo/bravo',
					path: null };

				resolver.resolve(request, function (result) {
					expect(result.path).toEqual(basePath + "/subpathBravo/_bravo.scss");
					done();
				});
			});
		});
	});
});
