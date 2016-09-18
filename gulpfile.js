var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
// var livereload = require('gulp-livereload');
var refresh = require('gulp-refresh');
var connect = require('gulp-connect');
var path = require('path');
var less = require('gulp-less');
var exec = require('gulp-exec');
var open = require('gulp-open');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
// var rename = require('gulp-rename');
// var sh = require('shelljs');
// var clean = require('gulp-clean');
var port = getRandom(8025, 8010);
var reportOptions = {
    err: true, // default = true, false means don't write err 
    stderr: true, // default = true, false means don't write stderr 
    stdout: true // default = true, false means don't write stdout 
};

var options = {
    continueOnError: true, // default = false, true means don't emit error event 
    pipeStdout: false, // default = false, true means stdout is written to file.contents 
    customTemplatingThing: "test" // content passed to gutil.template() 
};

var paths = {
    css: ['./frontend/css/*.css'],
    html: ['./frontend/*.html'],
    script: ['./frontend/js/*.js'],
    image: ['./frontend/img/*'],
    less: ['./frontend/css/*.less'],
};


gulp.task('serve', function() {
    // browserSync.init({
    //     server: {
    //         baseDir: "./"
    //     }
    // });
    // browserSync({
    //         // proxy: 'http://dev.sogec.ma/',
    //         port: 8080,
    //         open: true,
    //         notify: false,
    //         server: {
    //             baseDir: "./"
    //         }
    //     });
    connect.server({
        root: ['./frontend'],
        base: 'localhost',
        livereload: false,
        port: Math.floor(port)
    });
    browserSync.init({
        proxy: 'localhost:' + Math.floor(port),
        // browser: ['google chrome'],
        notify: true,
        open: true,
    });

    // gulp.watch("frontend/img/*.*").on('change', browserSync.reload);
    // gulp.watch("frontend/js/*/*.js").on('change', browserSync.reload);
    // gulp.watch("./frontend/css/*.css").on('change', browserSync.reload);
    gulp.watch("./frontend/css/*.less", ['sass']);
    gulp.watch("frontend/*.html").on('change', browserSync.reload);

});

gulp.task('sass', function() {
  console.log('yess')
        return gulp.src('./frontend/css/global.less')
        .pipe(less())
        .pipe(gulp.dest('./frontend/css'))
        .pipe(exec('lessc --rtl ./frontend/css/global.less ./frontend/css/global-rtl.css', options))
        .pipe(exec.reporter(reportOptions))
        .pipe(browserSync.stream());
});





gulp.task('html', function() {
    gulp.src(paths.html)
        .pipe(refresh())
});

gulp.task('script', function() {
    gulp.src(paths.script)
        .pipe(refresh())
});

gulp.task('image', function() {
    gulp.src(paths.image)
        .pipe(refresh())
});

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
});

gulp.task('default', ['watch', 'connect', 'app']);

gulp.task('watch', function() {
    // livereload.listen();
    refresh.listen();
    gulp.watch(paths.html, ['html']);
    // gulp.watch(paths.css, ['css']);
    gulp.watch(paths.image, ['image']);
    gulp.watch(paths.script, ['script']);
    gulp.watch(paths.less, ['less', 'autoprefixer']);
    console.log('\u0007');
});

gulp.task('connect', function() {
    connect.server({
        root: ['./frontend'],
        base: 'http://192.168.1.115',
        livereload: true,
        port: Math.floor(port)
    });
});

gulp.task('app', function() {
    var options = {
        uri: 'http://192.168.1.115:' + Math.floor(port)
            // app: 'chrome'
    };
    gulp.src(__filename)
        .pipe(open(options));
});

function onError(err) {
    console.log(err);
    this.emit('end');
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

// gulp.task('install', ['git-check'], function() {
//   return bower.commands.install()
//     .on('log', function(data) {
//       gutil.log('bower', gutil.colors.cyan(data.id), data.message);
//     });
// });

// gulp.task('git-check', function(done) {
//   if (!sh.which('git')) {
//     console.log(
//       '  ' + gutil.colors.red('Git is not installed.'),
//       '\n  Git, the version control system, is required to download Ionic.',
//       '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
//       '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
//     );
//     process.exit(1);
//   }
//   done();
// });

// gulp.task('scripts', function(done) {
//   gulp.src('app/js/**/*.js')
//     // .pipe(sourcemaps.init())
//     .pipe(concat('all.min.js'))
//     // .pipe(uglify('all.min.js'))
//     // .pipe(sourcemaps.write())
//     .pipe(gulp.dest('./www/js'))
//     .on('end', done);
// });

// gulp.task('lib', function(done) {
//   gulp.src('app/lib/**/*.js')
//     .pipe(concat('lib.min.js'))
//     // .pipe(uglify('lib.min.js'))
//     .pipe(gulp.dest('./www/js'))
//     .on('end', done);
// });

// gulp.task('templates', function(done) {
//   gulp.src('app/templates/*.html')
//     .pipe(minifyHTML({ empty: true }))
//     .pipe(templateCache())
//     .pipe(concat('templates.js'))
//     .pipe(gulp.dest('./www/js'))
//     .on('end', done);
// });

// gulp.task('css', function(done) {
//   gulp.src('app/css/*.css')
//     .pipe(concat('all.css'))
//     .pipe(cssnano())
//     .pipe(gulp.dest('./www/css'))
//     .on('end', done);
// });

// gulp.task('lib-css', function(done) {
//   gulp.src('app/lib/**/*.css')
//     .pipe(concat('lib-all.css'))
//     .pipe(cssnano())
//     .pipe(gulp.dest('./www/css'))
//     .on('end', done);
// });

// gulp.task('clean', function () {
//   return gulp.src('./www', {read: false})
//     .pipe(clean())
// });

// gulp.task('compress', ['clean', 'scripts', 'lib', 'css', 'lib-css']);
