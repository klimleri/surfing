const gulp = require('gulp');
const { src, dest, series, parallel, watch } = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const browserify = require('gulp-browserify');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();
const njkRender = require('gulp-nunjucks-render');
const ghPages = require('gulp-gh-pages');

function nunjucks() {
    return src('src/templates/*.njk')
        .pipe(njkRender())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(rename('index.html'))
        .pipe(dest('build'))
        .pipe(browserSync.stream());
}
function css() {
    return src('src/scss/index.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cleanCss())
        .pipe(rename('main.css'))
        .pipe(dest('build'))
        .pipe(browserSync.stream());
}
function js() {
    return src('src/js/main.js')
        .pipe(browserify({ transform: [babelify.configure({ presets: ['@babel/preset-env'] })] }))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(rename('main.bundle.js'))
        .pipe(dest('build'))
        .pipe(browserSync.stream());
}
function images() {
    return src('src/assets/*')
        .pipe(imagemin())
        .pipe(dest('build/assets'))
        .pipe(browserSync.stream());
}
function fonts() {
    return src('src/fonts/*')
        .pipe(dest('build/fonts'));
}
function clean(){
    return del(['./build/*']);
}
function dev(){
    browserSync.init({
        server: './build'
    });
    watch('src/templates/*', nunjucks);
    watch('src/scss/*.scss', css);
    watch('src/js/**/*.js', js);
    watch('src/assets/*', images);
}
function build(){
    return series(clean, parallel(js, css), images, fonts, nunjucks);
}

exports.build = build();
exports.dev = series(clean, build(), dev);

gulp.task('deploy', function() {
    return gulp.src('./build/**/*')
        .pipe(ghPages());
});