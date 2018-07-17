// http://danbahrami.io/articles/building-a-production-website-with-hugo-and-gulp-js/
// https://blog.khophi.co/migrate-gulp-4-complete-example/
// https://github.com/Dragory/gulp-hash

var browser = require('browser-sync').create();
var gulp = require('gulp');
var sass = require('gulp-sass');
var hash = require('gulp-hash');
var uglify = require('gulp-uglify');
var del = require('del');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var inlineCss = require('gulp-inline-css');
var postcssProcessors = [
    autoprefixer( { browsers: ['last 2 versions', 'ie > 10'] } )
]

// Clean output folder
gulp.task('server', function() {
    browser.init({

        // Inject CSS changes without the page being reloaded
        injectChanges: true,

        // What to serve
        server: {
            baseDir: 'dist'
        },

        // The port
        port: 1234
    });

  // Watch for file changes
  gulp.watch('src/scss/**/*', gulp.parallel('scss'));
  gulp.watch('src/js/**/*', gulp.parallel('js'));
  gulp.watch('src/images/**/*', gulp.parallel('images'));
  gulp.watch('public/**/*.html', gulp.parallel('inline-scss'));
});


// Clean output folder
gulp.task('clean', function() {
  return del(['static']);
});

gulp.task('sass-inline', function() {
    var stream = gulp.src('src/scss/inline.scss')
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(gulp.dest('build/css/'));
        return stream;

});
gulp.task('embed-scss', function() {
    var stream = gulp.src('src/scss/embedded.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(gulp.dest('build/css/'));
        return stream;

});
gulp.task('inline-scss', function() {
  var stream = gulp.src('public/*.html')
      .pipe(inlineCss({
        applyStyleTags: true,
        removeStyleTags: false,
        removeLinkTags: false
      }))
      .pipe(gulp.dest('public/'))
      return stream;
});

// Compile and hash SCSS files to CSS
gulp.task('scss', function() {
  var stream = gulp.src('src/scss/**/*.scss')
    .pipe(sass({outputStyle : 'compressed'}))
    .pipe(gulp.dest('static/css'))
    return stream;
});

// Compile javascript
gulp.task('js', function() {
  var stream = gulp.src('src/js/**/*')
  .pipe(uglify())
  .pipe(gulp.dest('static/js'))
  return stream;
});

// Compile images
gulp.task('images', function() {
  var stream = gulp.src('src/images/**/*')
    .pipe(gulp.dest('static/images'));
    return stream;
});

// Watch for changes, output
gulp.task('watch', function() {
  gulp.watch('src/scss/**/*', gulp.parallel('scss'));
  gulp.watch('src/js/**/*', gulp.parallel('js'));
  gulp.watch('src/images/**/*', gulp.parallel('images'));
  gulp.watch('src/html/**/*', gulp.parallel('inline-scss'));
});

gulp.task('default', gulp.series('clean', gulp.parallel('scss', 'images', 'js'), 'inline-scss', 'server'));