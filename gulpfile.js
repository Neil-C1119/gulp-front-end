'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const uglifyCss = require('gulp-uglifycss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const del = require('del');
const imagemin = require('gulp-imagemin');
const webserver = require('gulp-webserver');

gulp.task('concatScripts', function () {
    return gulp.src(['js/circle/autogrow.js', 'js/circle/circle.js'])
        .pipe(maps.init())
        .pipe(concat('all.js'))
        .pipe(maps.write('../dist'))
        .pipe(gulp.dest('js'));
});

gulp.task('minifyScripts', ['concatScripts'], function() {
    return gulp.src(['js/all.js'])
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('scripts', ['minifyScripts'], function () {
    return gulp.src(['js/all.min.js'])
        .pipe(gulp.dest('dist/scripts'));
});

gulp.task('concatSass', function () {
    return gulp.src(['sass/**/*.scss', 'sass/*.scss'])
        .pipe(concat('application.scss'))
        .pipe(gulp.dest('sass'));
});

gulp.task('compileSass', ['concatSass'], function () {
    return gulp.src(['sass/application.scss'])
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('../dist'))
        .pipe(gulp.dest('css'));
});

gulp.task('minifyCss', ['compileSass'], function () {
    return gulp.src(['css/application.css'])
        .pipe(uglifyCss())
        .pipe(rename('application.min.css'))
        .pipe(gulp.dest('css'));
});

gulp.task('styles', ['minifyCss'], function () {
    return gulp.src(['css/application.min.css'])
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('images', function () {
    return gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/content'));
});

gulp.task('clean', function () {
    return del(['dist/*']);
});

gulp.task('build', ['clean', 'scripts', 'styles', 'images'], function() {
    return gulp.src(['index.html', 'icons/**'], { base: './' })
        .pipe(gulp.dest('dist'));
});

gulp.task('watchFiles', function () {
    return gulp.watch(['sass/**/*.scss'], ['styles'])
        .pipe(webserver({ port: 3005, open: true }));
});

gulp.task('default', ['build', 'watchFiles'], function() {
    gulp.src('./')
        .pipe(webserver({ port: 3005, open: true }));
});