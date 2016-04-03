"use strict";

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
     del = require('del');

gulp.task("concatScripts", function() {
  // Using 'return' makes sure that this process finishes before the next one starts.
  // Provides an array of JS files to concat.
  return gulp.src([
      'js/jquery.js',
      'js/sticky/jquery.sticky.js',
      'js/main.js'
      ])
  // Initialize source mapping chain. Accepts options.
  .pipe(maps.init())
  // Specifies what file name to concat the rest of the JS files under.
  .pipe(concat('app.js'))
  // Sets destination path for js map file.  Accepts options.
  .pipe(maps.write('./'))
  // Sets destination path for concatinated js file.  
  .pipe(gulp.dest('js'));
});

// Specifies that concatScripts is a dependency of minifyScripts.
gulp.task("minifyScripts", ["concatScripts"], function() {
  // Using 'return' makes sure that this process finishes before the next one starts.
  return gulp.src("js/app.js")
    // Minifies the source file or array of files.
    .pipe(uglify())
    // Renames the file so it doesn't override the original app.js file.
    .pipe(rename('app.min.js'))
    // Sets the destination directory for the file to be saved in.
    .pipe(gulp.dest('js'));
});

gulp.task('compileSass', function() {
  // Using 'return' makes sure that this process finishes before the next one starts.
  return gulp.src("scss/application.scss")
    // Initialize source mapping chain. Accepts options.
    .pipe(maps.init())
    // Compiles Sass files.
    .pipe(sass())
    // Sets destination path for css map file.  Accepts options.
    .pipe(maps.write('./'))
    // Sets destination path for the css file.  
    .pipe(gulp.dest('css'));
});

gulp.task('watchFiles', function() {
  // Uses gulp's 'watch' method to watch changes in the scss globbing pattern files.
  gulp.watch('scss/**/*.scss', ['compileSass']);
  // Uses gulp's 'watch' method to watch changes in the JS files and recompile the main.js file.
  gulp.watch('js/main.js', ['concatScripts']);
});

// Sets the 'clean' task to delete compiled code.
gulp.task('clean', function() {
  // Deletes the dist directory and the css file as well as the files within the JS globbing pattern.
  del(['dist', 'css/application.css*', 'js/app*.js*']);
});

// Sets the 'build' task to run minifyScripts and compileSass.
gulp.task("build", ['minifyScripts', 'compileSass'], function() {
  // Takes the css, js, index.html, img and fonts files in the base directory
  // and places them into the dist directory.
  // They are actually linked there using a symbolic link.
  return gulp.src(["css/application.css", "js/app.min.js", 'index.html',
                   "img/**", "fonts/**"], { base: './'})
            // Defines the directory to use for this process.
            .pipe(gulp.dest('dist'));
});

// Sets the 'serve' task to run 'watchFiles' which watches changes on both the Sass and JS files.
gulp.task('serve', ['watchFiles']);

// Runs the 'clean' task before running the 'build' task. 
// Allowing the default task to delete all existing versions of the generated files before generating new versions.
gulp.task("default", ["clean"], function() {
  // Starts the build task after the 'clean' task has completed.
  gulp.start('build');
});
