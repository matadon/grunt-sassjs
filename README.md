# grunt-sassjs

Pure JavaScript SASS builds for the discerning Gruntist.

## Installing The Things
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check
out the [Getting Started](http://gruntjs.com/getting-started) guide, as it
explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as
well as install and use Grunt plugins. Once you're familiar with that
process, you may install this plugin with this command:

```shell
npm install grunt-sassjs --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile
with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-sassjs');
```

## Making Those Things Do Actual Work

In your project's Gruntfile, add a section named `sassjs` to the data object
passed into `grunt.initConfig()`:

```js
grunt.initConfig({
    sassjs: {
        all: { 
            options: {
                sourcePath: "path/to/sass/files",
                destinationPath: "path/to/build/output"
            }
        }
    },
});
```

Where `sourcePath` and `destinationPath` specify the respective locations of
the input files and build results, respectively.

Optionally, you can add an `importPath` where SassJS will look for
additional imports:

```js
grunt.initConfig({
    sassjs: {
        all: { 
            options: {
                sourcePath: "path/to/sass/files",
                destinationPath: "path/to/build/output"
                importPath: "path/to/extra/importness"
            }
        }
    },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality. Lint and test
your code using [Grunt](http://gruntjs.com/).
