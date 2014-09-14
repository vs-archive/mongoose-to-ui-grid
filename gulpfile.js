'use strict';

var gulp = require('gulp');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('lint', function () {
  return gulp
    .src(['lib/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('default', ['lint']);