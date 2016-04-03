'use strict';

var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
  useref = require('gulp-useref'),
     iff = require('gulp-if'),
    csso = require('gulp-csso'),
     del = require('del');

// Sets an options object.
var options = {
  src: 'src',
  dist: 'dist'
};


gulp.task('compileSass', function() {
  // Using 'return' makes sure that this process finishes before the next one starts.
  return gulp.src(options.src + "/scss/application.scss")
    // Initialize source mapping chain. Accepts options.
    .pipe(maps.init())
    // Compiles Sass files.
    .pipe(sass())
    // Sets destination path for css map file.  Accepts options.
    .pipe(maps.write('./'))
    // Sets destination path for the css file. 
    .pipe(gulp.dest(options.src + '/css'));
});

gulp.task('watchFiles', function() {
  // Uses gulp's 'watch' method to watch changes in the globbing pattern provided.
  gulp.watch(options.src + '/scss/**/*.scss', ['compileSass']);
});

// Sets the 'clean' task to delete compiled code.
gulp.task('clean', function() {
  // Deletes the dist directory and the css file as well as the files within the JS globbing pattern.
  del(['dist', 'css/application.css*', 'js/app*.js*']);
});

// Sets the 'html' task to useref package.
gulp.task('html', ['compileSass'], function() {
  // Stores the file paths from the HTML files into assets.
  var assets = useref.assets();
  gulp.src(options.src + '/index.html')
      .pipe(assets)
      // If file ends in .js runs uglify module.
      // Minifies JS files.
      .pipe(iff('*.js', uglify()))
      // If file ends in .css runs csso module.
      // Minifies CSS files.
      .pipe(iff('*.css', csso()))
      .pipe(assets.restore())
      .pipe(useref())
      // Sets destination path. 
      .pipe(gulp.dest(options.dist));
});

gulp.task("build", ['html'], function() {
  // Takes the css, js, index.html, img and fonts files in the base directory
  // and places them into the dist directory.
  // They are actually linked there using a symbolic link.
  return gulp.src([options.src + "/img/**", options.src + "/fonts/**"], { base: options.src})
            // Defines the directory to use for this process.
            .pipe(gulp.dest(options.dist));
});

// Sets the 'serve' task to run 'watchFiles' which watches changes on both the Sass and JS files.
gulp.task('serve', ['watchFiles']);

// Runs the 'clean' task before running the 'build' task. 
// Allowing the default task to delete all existing versions of the generated files before generating new versions.
gulp.task("default", ["clean"], function() {
  // Starts the build task after the 'clean' task has completed.
  gulp.start('build');
});

