var gulp = require('gulp')
var jshint = require('gulp-jshint')
var mocha = require('gulp-mocha')

var paths = {
  lint: [
    '*.js', '*.json',
    'browser/**/*.js',
    'core/**/*.js',
    'server/**/*.js',
    'test/**/*.js',
  ],

  mocha: [
    'core/**/*.js',
    'server/**/*.js',
    'test/**/*.js',
  ],
}

gulp.task('lint', function(){
  return gulp.src(paths.lint)
           .pipe(jshint())
           .pipe(jshint.reporter('default'))
})

gulp.task('watch-lint', function(){
  gulp.watch(paths.lint, ['lint'])
})

gulp.task('mocha', function(){
  return gulp.src(paths.mocha)
           .pipe(mocha())
})

gulp.task('watch-mocha', function(){
  gulp.watch(paths.mocha, ['mocha'])
})

gulp.task('test', ['lint', 'mocha'])

gulp.task('watch-test', ['watch-lint', 'watch-mocha'])
