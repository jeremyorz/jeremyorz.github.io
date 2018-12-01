let autoprefixer = require("gulp-autoprefixer"),
  babel = require("gulp-babel"),
  browserSync = require("browser-sync").create(),
  cleanCSS = require("gulp-clean-css"),
  concat = require("gulp-concat"),
  gulp = require("gulp"),
  path = require("path"),
  sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  svgSprite = require("gulp-svg-sprite");

let svgConfig = {
  svg: {
    namespaceClassnames: false
  },
  mode: {
    symbol: {
      dest: ".",
      sprite: "sprite.svg"
    }
  }
};

// Browsers you care about for autoprefixing.
let autoprefixer_browsers = ["last 2 versions", "ie 9", "ios 6", "android 4"];

// Compile SCSS files and export to dist/css/global.min.css
gulp.task("sass", () => {
  return (
    gulp
      .src("src/scss/global.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(autoprefixer(autoprefixer_browsers))
      // .pipe(cleanCSS())
      .pipe(concat("global.min.css"))
      .pipe(gulp.dest("dist/css"))
      .pipe(browserSync.reload({ stream: true }))
  );
});

// Compile JS files
// Output to dist/js/vendors.js and dist/js/global.js
gulp.task("js", () => {
  gulp
    .src(["src/js/global.js"])
    .pipe(babel({ presets: ["env"] }))
    .pipe(concat("global.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/js/"))
    .pipe(browserSync.reload({ stream: true }));

  return;
});

// Build SVG spritesheet
gulp.task("svg", () => {
  gulp
    .src(["src/files/svg/**/*.svg"])
    .pipe(svgSprite(svgConfig))
    .pipe(gulp.dest("dist/files/images"));

  return;
});

// Copy files
gulp.task("files", () => {
  gulp.src(["src/files/fonts/**/*"]).pipe(gulp.dest("dist/files/fonts"));

  gulp.src(["src/files/images/**/*"]).pipe(gulp.dest("dist/files/images"));
});

gulp.task("browserSync", () => {
  browserSync.init({
    server: {
      baseDir: "dist"
    }
  });
});

// Watch SCSS and JS file changes
gulp.task("watch", ["sass"], () => {
  gulp.watch("src/scss/**/*.scss", ["sass"]);
  gulp.watch("src/js/**/*.js", ["js"]);
  gulp.watch(["dist/css/*.css", "dist/js/*.js"], browserSync.reload);
});

gulp.task("dev", ["sass", "js", "files", "svg", "watch"]);

gulp.task("default", ["sass", "js", "files", "svg"]);
