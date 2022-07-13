const { src, dest, series, parallel, watch } = require('gulp');

const browserSync = require('browser-sync').create();

const fileInclude = require('gulp-file-include');

const htmlMin = require('gulp-htmlmin');

const sass = require('gulp-sass')(require('sass'));

const csso = require('gulp-csso');

const font = require('gulp-fonter');

const webp = require('gulp-webp');

const del = require('del');

const autoprefixer = require('gulp-autoprefixer');

const concat = require('gulp-concat');

const imageMin = require('gulp-imagemin');

const webpHTML = require('gulp-webp-html');

const sourcemaps = require('gulp-sourcemaps');

const ttf2woff2 = require('gulp-ttf2woff2');

const babel = require('gulp-babel');

const webpack = require('webpack-stream');

const uglify = require('gulp-uglify-es').default;



const server = () => {
   browserSync.init({
      server: {
         baseDir: './public/'
      }
   });
};

const html = () => {
   return src('./src/*.html')
      .pipe(sourcemaps.init())
      .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
      .pipe(webpHTML())
      .pipe(htmlMin({ collapseWhitespace: true }))
      .pipe(sourcemaps.write())
      .pipe(dest('./public/'))
      .pipe(browserSync.stream());
}

const scss = () => {
   return src('./src/scss/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer({
         overrideBrowserslist: ['last 5 version'],
         grid: true
      }))
      .pipe(concat("main.css"))
      .pipe(dest('./public/css'))
      .pipe(csso())
      .pipe(concat("main.min.css"))
      .pipe(sourcemaps.write())
      .pipe(dest('./public/css'))
      .pipe(browserSync.stream());
}


const image = () => {
   return src('./src/images/**/*')
      .pipe(imageMin())
      .pipe(dest('./public/images'))
      .pipe(webp())
      .pipe(dest('./public/images/'));
}


const fonts = () => {
   return src('./src/fonts/**/*')
      .pipe(font({ formats: ["ttf", "woff", "eot", "svg"] }))
      .pipe(ttf2woff2())
      .pipe(dest('./public/fonts/'));
}

const js = () => {
   return src('./src/js/*.js')
      .pipe(babel())
      .pipe(webpack({ mode: "development" }))
      .pipe(uglify())
      .pipe(dest('./public/js/'));
}

const clear = () => {
   return del('./public/');
}

const watcher = () => {
   watch('./src/**/*.html', html).on('change', browserSync.reload);
   watch('./src/scss/**/*.scss', scss).on('change', browserSync.reload);
   watch('./src/js/**/*.js', js).on('change', browserSync.reload);
}


module.exports.html = html;
module.exports.scss = scss;
module.exports.clear = clear;
module.exports.watch = watcher;
module.exports.image = image;
module.exports.js = js;
module.exports.font = fonts;
module.exports.server = server;

module.exports.build = series(clear, image, fonts, html, scss, js);

module.exports.start = series(this.build, parallel(server, watcher));




