var gulp = require('gulp');
var webpack = require('webpack-stream');
var runSequence = require('run-sequence');
var del = require('del');
var zip = require('gulp-zip');

var versionNumber = require('./app/manifest.json').version;


gulp.task('cleanall', function() {
  return del(['app/app.js', 'temp', 'app/vendor', 'app/options.js']);
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

  gulp.src('node_modules/font-awesome/css/**/*')
    .pipe(gulp.dest('app/vendor/font-awesome/css'));

  gulp.src('node_modules/font-awesome/fonts/**/*')
    .pipe(gulp.dest('app/vendor/font-awesome/fonts'));

});

// webpack the popup app
gulp.task('webpack-popup', function() {
  return gulp.src('components/app.jsx')
  .pipe(webpack( require('./popup-webpack.config.js') ))
  .pipe(gulp.dest('app/'));
});

// webpack the options app
gulp.task('webpack-options', function() {
  return gulp.src('components/options.jsx')
  .pipe(webpack( require('./options-webpack.config.js') ))
  .pipe(gulp.dest('app/'));
});

gulp.task('package', function(){
  return gulp.src('app/**/*')
    .pipe(zip('Serum-'+versionNumber+'.zip'))
    .pipe(gulp.dest('.'));
});


gulp.task('watch', function(){
  gulp.watch(['components/**/*'], ['build-sequence']);
});

gulp.task('copystuff', ['copy-github-js','copy-bootstrap', 'copy-fontawesome']);

gulp.task('build-sequence', function(callback) {
  runSequence('cleanall', 'webpack-options', 'webpack-popup', 'copystuff', callback);
});

gulp.task('default', ['build-sequence', 'watch']);

gulp.task('dist', function(callback){
  runSequence('build-sequence', 'package', callback);
});
