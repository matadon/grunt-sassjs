'use strict';

var DirectoryCompiler = require("../src/directory_compiler");
var Lodash = require("lodash");

describe("DirectoryCompiler", function() {
	describe(".compile", function() {
		var actualResult = {};

		var fakeFileUtils = jasmine.createSpyObj("FileUtils",
			[ "findAllSassFilesIn" ]);

		var fakeSassCompiler = jasmine.createSpyObj("SassCompiler",
			[ "compile" ]);

		var directoryCompiler = new DirectoryCompiler({
			fileUtils: fakeFileUtils,
			sassCompiler: fakeSassCompiler
		});

		function ensureDoneCallbackRuns(sourceFile, destinationFile, done) {
			actualResult[sourceFile] = destinationFile;
			done();
		}

		it("should compile all scss files within a directory", function(done) {
			var expectedResult = {
				"/input/main.scss": "/output/main.css",
				"/input/screenreader.scss": "/output/screenreader.css" }

			var sourceFiles = Lodash.keys(expectedResult);

			fakeFileUtils.findAllSassFilesIn.and.returnValue(sourceFiles);
			fakeSassCompiler.compile.and.callFake(ensureDoneCallbackRuns);

			var afterCompile = function () {
				expect(fakeFileUtils.findAllSassFilesIn)
					.toHaveBeenCalledWith("/input");
				expect(Lodash.isEqual(expectedResult, actualResult)).toBe(true);
				done();
			}

			directoryCompiler.compile("/input", "/output", afterCompile);
		});
	});
});
