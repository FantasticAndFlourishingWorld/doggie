var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');

gulp.task('uglify', function () {
  return gulp.src(['./public/theme/*.js', '!./public/theme/*.min.js'])
    .pipe(uglify())
    .pipe(gulp.dest('./public/theme'));
});

gulp.task('rename', ['uglify'], function () {
  return gulp.src(['./public/theme/*.js', '!./public/theme/*.min.js'])
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./public/theme'));
});

gulp.task('delete', ['uglify', 'rename'], function (cb) {
  del(['./public/theme/*.js', '!./public/theme/*.min.js'], cb);
});

gulp.task('default', ['uglify', 'rename', 'delete']);
