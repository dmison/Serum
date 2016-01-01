var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('cleanall', function() {
  return del(['app/app.js', 'temp', 'app/vendor', 'app/options.js']);
});

gulp.task('build-sequence', function(callback) {
  runSequence('cleanall', 'react-jsx', 'webpack', 'webpack-options', 'copystuff', callback);
});

// [todo] - waiting for githubjs update to 0.10.8 to resolve https://github.com/michael/github/issues/259

gulp.task('copy-github-js', function(){
  return gulp.src('node_modules/github-api/github.js')
    .pipe(gulp.dest('app/vendor'));
});

gulp.task('copy-bootstrap', function(){
  return gulp.src('node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('app/vendor/bootstrap'));
});

gulp.task('copy-fontawesome', function(){

  return gulp.src('node_modules/font-awesome/css/**/*')
    .pipe(gulp.dest('app/vendor/font-awesome/css'));

  return gulp.src('node_modules/font-awesome/fonts/**/*')
    .pipe(gulp.dest('app/vendor/font-awesome/fonts'));

});

gulp.task('react-jsx', function() {
  return gulp.src('components/**.*')
    .pipe(babel({'presets': ['react']}))
    .pipe(gulp.dest('temp'));
});

gulp.task('webpack', function() {
  return gulp.src('temp/app.js')
    .pipe(webpack({output: {filename: 'app.js'}}))
    .pipe(gulp.dest('app'));
});

gulp.task('webpack-options', function() {
  return gulp.src('temp/options.js')
    .pipe(webpack({output: {filename: 'options.js'}}))
    .pipe(gulp.dest('app'));
});



gulp.task('watch', function(){
  gulp.watch(['components/**/*'], ['build-sequence']);
});

gulp.task('copystuff', ['copy-github-js','copy-bootstrap', 'copy-fontawesome']);

gulp.task('default', ['build-sequence', 'watch']);
