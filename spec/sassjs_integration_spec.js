'use strict';

var Lodash = require("lodash");
var Fs = require("fs");
var Remove = require("remove");
var Mkdirp = require('mkdirp');
var Glob = require("glob");
var Path = require("path");

describe("integration for the sassJs grunt task", function() {
	var Grunt;

	var testOutputPath = "./tmp/test";

	var fixturePath = "./spec/fixtures";

	function forceUnloadFromRequireCache(path) {
		Lodash.forIn(require.cache, function(value, key) {
			if(key.match(path)) {
				delete require.cache[key];
			}
		});
	}

	function loadExpectedResultsFromFixtures(fixtureName, gruntConfig) {
		var expectedOutputPath = Path.join(fixturePath, fixtureName);
		var destinationPath = gruntConfig.destinationPath;
		var sourceFiles = Glob.sync(Path.join(gruntConfig.sourcePath, "*.scss"));
		var expectedOutputFiles = {};

		Lodash.each(sourceFiles, function(sourceFile) {
			var filename = Path.basename(sourceFile, ".scss") + ".css";
			if(! filename.match(/^_/)) {
				var actualFilename = Path.join(destinationPath, filename);
				var expectedFilename = Path.join(expectedOutputPath,
					"/expected-" + filename);
				expectedOutputFiles[actualFilename] = expectedFilename;
			}
		});

		expect(Lodash.isEmpty(expectedOutputFiles)).toBe(false);

		return expectedOutputFiles;
	}

	function buildGruntConfig(fixtureName, extraOptions) {
		var defaultSourcePath = Path.join(fixturePath, fixtureName);
		var defaultDestinationPath = Path.join(testOutputPath, fixtureName);
		var defaultOptions = { sourcePath: defaultSourcePath,
			destinationPath: defaultDestinationPath };
		return Lodash.merge(defaultOptions, extraOptions || {});
	}

	function runSassJsTaskWithConfig(options, done) {
		var gruntConfig = { sassjs: { all: { options: options } } };

		Grunt.initConfig(gruntConfig);
		Grunt.task.run("sassjs");
		Grunt.task._options.done = done;
		Grunt.task.start();
	};

	function ensureFreshGruntForEveryTest() {
		forceUnloadFromRequireCache("node_modules/grunt/");
		Grunt = require('grunt');
		Mkdirp.sync(testOutputPath);
		Grunt.loadTasks("./tasks");
		expect(Grunt.task.exists("sassjs")).toBeTruthy();
	}

	function loadCssFileForComparison(path) {
		var rawContent = Fs.readFileSync(path).toString();
		rawContent.trim().replace(/\s+/g, ' ');
	}

	function testCompilerUsingFixture(fixtureName, done, extraOptions) {
		var gruntConfig = buildGruntConfig(fixtureName, extraOptions);
		var outputFiles = loadExpectedResultsFromFixtures(fixtureName,
			gruntConfig);

		runSassJsTaskWithConfig(gruntConfig, function () {
			Lodash.each(outputFiles, function(actualFile, expectedFile) {
				var actual = loadCssFileForComparison(actualFile);
				var expected = loadCssFileForComparison(expectedFile);
				expect(actual).toEqual(expected);
			});
			done();
        });
	}

	beforeEach(ensureFreshGruntForEveryTest);

	afterEach(function () { Remove.removeSync(testOutputPath); });

	it("compiles a single sass file", function (done) {
		testCompilerUsingFixture("singleFile", done);
	});

	it("compiles a sass file with imports", function (done) {
		testCompilerUsingFixture("importPartial", done);
	});

	it("walks import trees correctly", function (done) {
		testCompilerUsingFixture("pathWalking", done);
	});

	it("imports multiple files", function(done){
		testCompilerUsingFixture("multiFileInclude", done);
	});

	it("accepts additional load paths", function(done) {
		var options = {
			importPath: "./spec/fixtures/additionalLoadPath/extraImportPath",
			sourcePath: "./spec/fixtures/additionalLoadPath/projectRoot"
		}

		testCompilerUsingFixture("additionalLoadPath", done, options);
	});

	it("compiles multiple sass files", function(done) {
		testCompilerUsingFixture("compileManyFiles", done);
	});
});
