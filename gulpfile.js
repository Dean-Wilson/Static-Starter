// Requirement for autoprefixer
require('es6-promise').polyfill();

// Requires
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var path = require('path');

// Stylesheets
gulp.task('sass', function () {
  return gulp.src('src/styles/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(cssnano())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream())
});

// Minify JS
gulp.task('js', function () {
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

// Vendor Concat
gulp.task('vendor', function () {
  return gulp.src('src/js/vendor/*.js')
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/vendor/'));
});

// Image Minify
gulp.task('images', function () {
  return gulp.src('src/img/*.+(png|jpg|gif)')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
});

//svg
gulp.task('svg', function() {
    
  return gulp.src('src/img/svg/*.svg')
  .pipe(plumber())
  .pipe(svgmin(function getOptions (file) {
      var prefix = path.basename(file.relative, path.extname(file.relative));
      return {
          plugins: [{
              cleanupIDs: {
                  prefix: prefix + '-',
                  minify: true
              }
          }]
      }
  }))
  .pipe(gulp.dest('dist/img/svg'));
});

//Watcher
gulp.task('watch', function () {
  gulp.watch('src/styles/*.scss', ['sass']);
  gulp.watch('src/js/*.js', ['js']).on('change', reload);
  gulp.watch('src/js/vendor/*.js', ['vendor']).on('change', reload);
  gulp.watch('src/img/*.+(png|jpg|gif)', ['images']).on('change', reload);
  gulp.watch('src/img/svg/*.+(svg)',['svg']).on('change', reload);
});

// Browsersync
gulp.task('serve', function () {
  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: "./"
    },
    tunnel: false // True for unique testing link
  });

  gulp.watch("*.html").on("change", reload);
});

// Run tasks on 'gulp'
gulp.task('default', ['sass', 'js', 'vendor', 'watch', 'serve', 'images','svg']);