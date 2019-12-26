"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var svgsprite = require("gulp-svg-sprites");
var cheerio = require("gulp-cheerio");
var replace = require("gulp-replace");
var webp = require("gulp-webp");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var del = require("del");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var htmlmin = require("gulp-htmlmin");
var uglify = require("gulp-uglify");

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    //.pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("webp", () =>
    gulp.src("source/img/*.{jpg,png}")
    .pipe(webp({
        quality: 90,
        preset: "photo",
        method: 4
    }))
    .pipe(gulp.dest("build/img/webp/"))
);

gulp.task("svg", function () {
  return gulp.src("source/img/*.svg")
  .pipe(cheerio({
    run: function ($) {
      $("[class]").removeAttr("class");
      $("[fill]").removeAttr("fill");
      //$("style").remove();
    },
    parserOptions: {
      decodeEntities: false,
      xmlMode: false
    }
  }))
  .pipe(replace("&gt;", ">"))
  .pipe(svgsprite({
    mode: "symbols",
    preview: true,
    selector: "%f",
    svg: {
      symbols: "sprite.svg"
    }
  }
  ))
  .pipe(replace("\t", "  "))
  .pipe(gulp.dest("build/img/"));
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"))
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"))
});

gulp.task("minifyhtml", function () {
  return gulp.src("build/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
});

gulp.task("uglify", function(){
  return gulp.src("source/js/**/*.js")
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename += ".min";
    }))
    .pipe(gulp.dest("build/js"))
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("copy", function () {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/*.ico"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"))
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/img/*.svg", gulp.series("svg", "refresh"));
  gulp.watch("source/img/**/*.{jpg,png}", gulp.series("optimizeimg", "refresh"));
  gulp.watch("source/*.html").on("change", gulp.series("html", "minifyhtml", "refresh"));
});

gulp.task("buildcontent", gulp.series(gulp.parallel("copy", "css", "svg", "uglify"), "html", "minifyhtml"));
gulp.task("optimizeimg", gulp.parallel("images", "webp"));
gulp.task("build", gulp.series("clean", gulp.parallel("buildcontent", "optimizeimg")));
gulp.task("start", gulp.series("build", "server"));
