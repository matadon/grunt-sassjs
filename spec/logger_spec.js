'use strict';

var Logger = require("../src/logger");

describe("Logger", function() {
	var fakeGrunt = jasmine.createSpyObj(["fatal"]);
	var logger = new Logger(fakeGrunt);

	describe(".error", function() {
		it("passes the error message to grunt", function () {
			var fakeGrunt = jasmine.createSpyObj(["fatal"]);
			var logger = new Logger(fakeGrunt);
			var message = "Problems, yo.";
			logger.error(message);
			expect(fakeGrunt.fatal).toHaveBeenCalledWith(message);
		});
	});

	describe(".info", function() {
		it("passes the info message to grunt", function () {
			var fakeGrunt = jasmine.createSpyObj(["ok"]);
			var logger = new Logger(fakeGrunt);
			var message = "Good, yo.";
			logger.info(message);
			expect(fakeGrunt.ok).toHaveBeenCalledWith(message);
		});
	});

	describe(".logExceptions", function() {
		it("logs to grunt", function () {
			var message = "BOOM";

			logger.logExceptions(function() {
				throw(message);
			});
			
			expect(fakeGrunt.fatal).toHaveBeenCalledWith(message);
		});
	});
});
