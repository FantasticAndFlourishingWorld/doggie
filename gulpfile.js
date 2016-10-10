var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');

gulp.task('uglify', function () {
  return gulp.src(['./theme/*.js', '!./theme/*.min.js'])
    .pipe(uglify())
    .pipe(gulp.dest('./theme'));
});

gulp.task('rename', ['uglify'], function () {
  return gulp.src(['./theme/*.js', '!./theme/*.min.js'])
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./theme'));
});

gulp.task('delete', ['uglify', 'rename'], function (cb) {
  del(['./theme/*.js', '!./theme/*.min.js'], cb);
});

gulp.task('default', ['uglify', 'rename', 'delete']);
