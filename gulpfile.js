var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint');

gulp.task('jshint', function () {
    gulp.src('./app/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
