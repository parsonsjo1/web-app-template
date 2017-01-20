var browserify = require("browserify");
var browserSync = require('browser-sync').create();
var buffer = require('vinyl-buffer');

var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');

var gulp = require('gulp');

var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');

var ts = require("gulp-typescript");
var tsify = require("tsify");

var uglify = require('gulp-uglify');

/*-------------------------------------------*/

var paths = {
    exclude: '!./node_modules/**',
    html: './src/**/*.html',
    images: './src/images/*.*',
    sass: './src/**/*.scss',
    typescript: './src/**/*.ts'
};

var watches = {
    html: 'html-watch',
    images: 'images-watch',
    sass: 'sass-watch',
    typescript: 'typescript-watch'
}



/************************BrowserSync****************************/

gulp.task('browser-sync', [watches.html,watches.images,watches.typescript,watches.sass], function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

/************************BrowserSync****************************/



/************************HTML Section***************************/

gulp.task("copy-html", function () {
    return  gulp.src([paths.html, paths.exclude])
            .pipe(gulp.dest("./dist"));
});

gulp.task(watches.html, ['copy-html'], function() {
    browserSync.reload();
    console.log("html reload complete");
});

/************************HTML Section***************************/



/************************Images*********************************/

gulp.task("copy-images", function () {
    return  gulp.src([paths.images, paths.exclude])
            .pipe(gulp.dest("./dist/images"));
});

gulp.task(watches.images, ['copy-images'], function() {
    browserSync.reload();
    console.log("images reload complete");
});

/************************Images***************************/



/************************Sass***********************************/

gulp.task('copy-sass', function () {
  return gulp.src([paths.sass, paths.exclude])
    .pipe(concat('all.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
});

gulp.task(watches.sass, ['copy-sass'], function() {
    browserSync.reload();
    console.log("sass reload complete");
});

/************************Sass***********************************/



/************************Typescript*****************************/

gulp.task('typescript', function() {
    return bundle();
});

gulp.task(watches.typescript, ['typescript'], function() {
    browserSync.reload();
    console.log("typescript reload complete");
});

var browserify = browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify);

function babelify() {
    return browserify
    .transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts']
    });
}

function bundle() {
    return babelify()
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
}

/************************Typescript*****************************/



/************************Watch Settings*************************/

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch([paths.html,        paths.exclude], [watches.html]);
    gulp.watch([paths.typescript,  paths.exclude], [watches.typescript]);
    gulp.watch([paths.sass,        paths.exclude], [watches.sass]);
});

gulp.task('default', ['watch'], function () {
    var pathNames = Object.getOwnPropertyNames(paths);
    pathNames.forEach(function(item) {
        console.log("Watching " + item);
    });
});

/************************Watch Settings*************************/