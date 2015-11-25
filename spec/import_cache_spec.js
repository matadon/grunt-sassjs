'use strict';

var ImportCache = require("../src/import_cache");

describe("ImportCache", function() {
	var cache;
    
    beforeEach(function () { cache = new ImportCache(); });

	describe(".moveTo", function () {
		it("absolute path to a file", function () {
            cache.moveTo(__filename);
            expect(cache.getCurrent()).toEqual(__dirname);
		});

        it("fails if import has never been requested", function () {
            var attempt = function() { cache.moveTo("ootstrap/ixins"); }
            expect(attempt).toThrow();
        });

        it("previously requested import", function () {
            cache.add({ requested: "ourbon/eat",
                resolved: "/path/to/ourbon/eat.scss" });
            cache.moveTo("ourbon/eat");
            expect(cache.getCurrent()).toEqual("/path/to/ourbon");
        });
	});
});
