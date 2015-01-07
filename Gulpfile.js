var gulp = require('gulp')
var jshint = require('gulp-jshint')
var mocha = require('gulp-mocha')

gulp.task('lint', function(){
  return gulp.src(['*.js', '*.json'])
           .pipe(jshint())
           .pipe(jshint.reporter('default'))
})

gulp.task('mocha', function(){
  return gulp.src('test/**/*.js')
           .pipe(mocha())
})

gulp.task('test', ['lint', 'mocha'])
