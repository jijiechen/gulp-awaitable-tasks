# Gulp awaitable tasks

[![NPM version][npm-image]][npm-url]

Runs a sequence of gulp steps within tasks synchronously.
This function is designed to solve the situation where want to order your steps within a task.

## Usage

First, install `gulp-awaitable-tasks` as a development dependency:

```shell
npm install --save-dev gulp-awaitable-tasks 
```

Then add use it in your gulpfile, like so (note these are only examples, please check the documentation for your functions for the correct way to use them):

```js
var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');

require('gulp-awaitable-tasks')(gulp);

// This will run steps in compile-css synchronously
// * compile all scss files to css files
// * wait for scss compiling to complete
// * minify all generated css files
// * callback and notify gulp that we are done
 gulp.task('compile-css', function*() {
//                        ^^^^^^^^^^
//                        This is a generator function
    yield gulp.src('./scss/**/*.scss',  { base: "./" })
//  ^^^^^
//  use *yield* keyword to await a stream or promise step 
        .pipe(sass())
        .pipe(gulp.dest('./styles'));

    yield gulp.src('./styles/**/*.css',  { base: "./" })
        .pipe(cssmin())
        .pipe(gulp.dest('.'));
 });
```



## LICENSE

[MIT License](http://en.wikipedia.org/wiki/MIT_License)


[npm-url]: https://npmjs.org/package/gulp-awaitable-tasks
[npm-image]: https://badge.fury.io/js/gulp-awaitable-tasks.png
