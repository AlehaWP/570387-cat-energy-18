"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var svgSprite = require("gulp-svg-sprites"),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace');
var webp = require('gulp-webp');

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task('webp', () =>
    gulp.src('source/img/*.{jpg,png}')
    .pipe(webp({
        quality: 80,
        preset: 'photo',
        method: 6
    }))
    .pipe(gulp.dest('source/img/webp/'))
);

gulp.task('svg', function () {
  return gulp.src('source/img/*.svg')
  .pipe(cheerio({
    run: function ($) {
      $('fill').remove();
      $('stroke').remove();
      $('style').remove();
      $('class').remove();
    },
    parserOptions: { xmlMode: false }
  }))
  .pipe(replace('&gt;', '>'))
  .pipe(svgSprite({
    mode: "symbols",
    preview: true,
    selector: "%f",
    svg: {
      symbols: 'sprite.svg'
    }
  }
  ))
  .pipe(gulp.dest("source/img/"));
});

gulp.task("start", gulp.series("css", "webp", "svg", "server"));
