'use strict';

var gulp = require('gulp-param')(require('gulp'), process.argv);
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var gzip = require('gulp-gzip');
var lab = require('gulp-lab');

var paths = {
  scss: [
    './src/scss/app.scss'
  ],
  js: [
    './src/**/*.js*',
    './gulpfile.js',
    './index.js'
  ],
  tests: [
    './tests/**/*.js*'
  ],
  compress: [
    './static/bundle.min.css',
    './static/bundle.min.css.map'
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

gulp.task('sass', function () {
  return gulp.src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(concat('bundle.min.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./static'));
});

gulp.task('sass:watch', function () {
  return gulp.watch(paths.scss, [
    'sass'
  ]);
});

gulp.task('compress', function () {
  return gulp.src(paths.compress)
    .pipe(gzip())
    .pipe(gulp.dest('./static'));
});

gulp.task('tests', ['lint-js'], function () {
  var options = {
    read: false
  };
  return gulp.src(paths.tests, options)
    .pipe(lab('-m 10000 -l -v -c -r console -o stdout -r console -o reports/coverage.txt -r html -o reports/coverage.html -r json -o reports/coverage.json'));
});

gulp.task('default', [
  'lint-js',
  'sass',
  'compress'
]);
