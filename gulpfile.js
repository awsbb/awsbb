'use strict';

var gulp = require('gulp-param')(require('gulp'), process.argv);
var eslint = require('gulp-eslint');
// var minifyCSS = require('gulp-minify-css');
// var sourcemaps = require('gulp-sourcemaps');
// var lab = require('gulp-lab');

var paths = {
    js: [
        './src/**/*.js*',
        './gulpfile.js',
        './index.js'
    ],
    tests: [
        './tests/**/*.js*'
    ]
};
paths.all = paths.js.concat(paths.tests);

gulp.task('lint-js', function () {
    return gulp.src(paths.all)
        .pipe(eslint({
            useEslintrc: true
        }))
        .pipe(eslint.formatEach())
        .pipe(eslint.failAfterError());
});

// gulp.task('minify-css', function () {
//     return gulp.src('./src/css/**/*.css')
//         .pipe(sourcemaps.init())
//         .pipe(minifyCSS())
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest('dist'));
// });

// gulp.task('tests', ['lint-js'], function () {
//     var options = {
//         read: false
//     };
//     return gulp.src(paths.tests, options)
//         .pipe(lab('-m 10000 -l -v -c -r console -o stdout -r console -o reports/coverage.txt -r html -o reports/coverage.html -r json -o reports/coverage.json'));
// });

gulp.task('default', [
    'lint-js'
    // 'minify-css',
    // 'tests'
]);
