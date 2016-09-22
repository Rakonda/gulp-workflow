const gulp          = require('gulp');
const gutil         = require('gulp-util');
const refresh       = require('gulp-refresh');
const connect       = require('gulp-connect');
const less          = require('gulp-less');
const open          = require('gulp-open');
const changed       = require('gulp-changed');
const notify        = require("gulp-notify");
const debug         = require('gulp-debug');
const imagemin      = require('gulp-imagemin');
const autoprefixer  = require('gulp-autoprefixer');


const baseRoot      = "./src";
const port          = Math.floor(Math.random() * (8045 - 8020) + 8020);
const portReload    = Math.floor(Math.random() * (35730 - 35700) + 35700);
const address       = 'http://localhost';
const paths         = {
    html: ['./src/*.html'],
    script: ['./src/js/**/*.js'],
    image: ['./src/img/*'],
    less: ['./src/css/*.less']
};

const connect_option = {
    root: baseRoot,
    base: address,
    livereload: {
        enable: true,
        port: portReload
    },
    port: port,
    debug: true
}
const open_options = {
    uri: address + ':' + port,
};

gulp.task('connect', function() {
    connect.server(connect_option);
    gulp.src(__filename).pipe(open(open_options));
});

gulp.task('less-task', function() {
    gulp.src('./src/less/*.less')
        .pipe(changed('./src/less/', {extension: '.less'}))
        .pipe(less())
        .pipe(autoprefixer({ browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'] }))
        .pipe(polyfill())
		.pipe(minifyCss())
        .pipe(gulp.dest('./src/css'))
        .pipe(refresh())
        .pipe(debug({ title: 'Debug :' }))
        .on('error', notify.onError("Error: <%= error.message %>"));
});

gulp.task('script-task', function() {
    gulp.src(paths.script)
        .pipe(changed('./src/js/', {extension: '.js'}))
        .pipe(debug({ title: 'Debug :' }))
        .pipe(gulp.dest('./src/js'))
        .pipe(refresh())
        .on('error', notify.onError("Error: <%= error.message %>"));
});

gulp.task('image-task', function() {
    gulp.src(paths.image)
        .pipe(changed('./src/img/'))
        .pipe(imagemin())
        .pipe(gulp.dest('./src/img'))
        .pipe(debug({ title: 'Debug :' }))
        .pipe(refresh())
        .on('error', notify.onError("Error: <%= error.message %>"));
});

<<<<<<< HEAD
gulp.task('html-task', function() {
    gulp.src('./src/*.html')
        .pipe(changed('./src/', {extension: '.html'}))
        .pipe(gulp.dest('./src/'))
=======
gulp.task('css', function() {
    gulp.src(paths.css)
        .pipe(refresh())
});

gulp.task('less', function() {
    gulp.src('./frontend/css/global.less')
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./frontend/css'))
        .pipe(exec('lessc --rtl ./frontend/css/global.less ./frontend/css/global-rtl.css', options))
        .pipe(exec.reporter(reportOptions))
        // .pipe(refresh())
});

gulp.task('autoprefixer', function() {
    gulp.src('./frontend/css/global.css')
        .pipe(autoprefixer(['last 2 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('./frontend/css'))
    gulp.src('./frontend/css/global-rtl.css')
        .pipe(autoprefixer(['last 2 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('./frontend/css'))
        .pipe(refresh())
        .pipe(debug({ title: 'Debug :' }))
        .on('error', notify.onError("Error: <%= error.message %>"));
});

gulp.task('watch', function() {
    refresh.listen(portReload);
    gulp.watch('./src/*.html', ['html-task']);
    gulp.watch('./src/img/*', ['image-task']);
    gulp.watch('./src/js/*.js', ['script-task']);
    gulp.watch('./src/less/*.less', ['less']);
});

/*----------  Default task  ----------*/
gulp.task('default', ['connect', 'html-task', 'less-task', 'script-task', 'image-task', 'watch']);
