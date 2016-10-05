"use strict";

//require modules
var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
     del = require('del'),
imagemin = require('gulp-imagemin'),
webserver = require('gulp-connect'),
runSequence = require('run-sequence'),
cssmin = require('gulp-clean-css');




//concat the scripts
gulp.task("concatScripts", function() {
    return gulp.src([
        'js/circle/autogrow.js',
        'js/circle/circle.js'
        ])
    .pipe(maps.init())
    .pipe(concat('global.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('js'));
});

//minify the scripts
gulp.task("scripts", ["concatScripts"], function() {
  return gulp.src("js/global.js")
  	.pipe(maps.init())
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(webserver.reload());
});

//compile sass
gulp.task('compileSass', function() {
  return gulp.src("sass/global.scss")
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('css'));


});

//minify the css
gulp.task('styles', ['compileSass'], function(){
    return gulp.src('css/global.css')
      .pipe(cssmin())
      .pipe(rename('all.min.css'))
      .pipe(gulp.dest('dist/styles'));


});

//clean task to clean up the folders before the build runs
gulp.task('clean', function() {
  return del(['dist/content/**', 'dist/scripts/**', 'dist/styles/**']);

});

//minifiy images, dest dist/content
gulp.task('images', function() {
  return gulp.src('images/*')
             .pipe(imagemin())
             .pipe(gulp.dest('dist/content'))
});

//watch function for any javascript file changes
gulp.task('watch', function() {
  gulp.watch(['js/**/*.js'], ['scripts']);
});

//use gulp connect to start a web server that uses live reload to reload the page with any changes
gulp.task('webserver', function() {
  webserver.server({
    livereload: true
  });
});

//set up the build task to call the other tasks, with clean completing first.
gulp.task('build', function() {
  runSequence('clean', ['scripts', 'styles', 'images']);
});

//set up the default gulp task to have build as a dependency.
gulp.task('default', ['build']);

//set up the serve task to build and serve the project while using watch for any changes
gulp.task('serve', ['build', 'webserver', 'watch']);


