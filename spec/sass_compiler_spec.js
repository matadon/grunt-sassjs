'use strict';

var Path = require("path");
var SassCompiler = require("../src/sass_compiler");

describe("SassCompiler", function() {
	describe(".compile", function() {
		var fakeLogger = jasmine.createSpyObj([ "error", "info" ]);
		var fakeFileUtils = jasmine.createSpyObj([ "readFile", "writeFile" ]);

		it("compiles CSS", function (done) {
			var sourceContent = ".error { color: red; }";
			var sourcePath = "/path/to/some/file.scss";
			var destinationPath = "/path/to/output/file.css";
			var compiler = new SassCompiler({ fileUtils: fakeFileUtils,
				logger: fakeLogger })

			fakeFileUtils.readFile.and.returnValue(sourceContent);

			var doneCompiling = function () {
				var expectedOutput = ".error {\n  color: red; }\n";
				expect(fakeFileUtils.writeFile)
					.toHaveBeenCalledWith(destinationPath, expectedOutput);
				done();
			}

			compiler.compile(sourcePath, destinationPath, doneCompiling);
		});

		it("ships errors to grunt", function (done) {
			var sourceContent = ".error { color: $undefined; }";
			var sourcePath = "/path/to/some/file.scss";
			var destinationPath = "/path/to/output/file.css";
			var compiler = new SassCompiler({ fileUtils: fakeFileUtils,
				logger: fakeLogger })

			fakeFileUtils.readFile.and.returnValue(sourceContent);

			var doneCompiling = function () {
				var errorMessage = fakeLogger.error.calls.mostRecent().args[0];
				expect(errorMessage).toContain("Undefined variable");
				done();
			}

			compiler.compile(sourcePath, destinationPath, doneCompiling);
		});
	});
});