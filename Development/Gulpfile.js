  /**
    Name:GulpFile.js 
    Work:Configuration Automatic Task Runner 
    Author:Rituraj Ratan
    Date:22-2-2015
  **/

'use strict';

/**
 * ======================START===========================
 */


/**
 * [gulp initilize all modules which we will use in our project]
 * @type {[nothing]}
 */
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    nodemon = require('gulp-nodemon'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    plugins = require("gulp-load-plugins")({
              pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
              replaceString: /\bgulp[\-.]/
            }),
    //livereload = require('gulp-livereload'),
    del = require('del');


/**
 * [in this section we do all css related task means here we are doing SCSS TO CSS]
 * @param  {[scss]}
 * @return {[css]}
 */

gulp.task('styles', function() {
  return sass('app/styles/main-new.scss',{ style: 'expanded' })
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

/**
 * [in this section we do all JS related task means 
 *  here we are doing JS TO .MIN JS and multiple js combined in single js]
 * @param  {[js]}
 * @return {[.min js]}
 */

gulp.task('bscripts', function() {
  // var jsFiles = ['app/scripts/**/*.js'];
  return gulp.src(plugins.mainBowerFiles())
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
    .pipe(plugins.filter('*.js'))
    .pipe(plugins.concat('vendor.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'Scripts  Bower task complete' }));
});

gulp.task('scripts', function() {
  // var jsFiles = ['app/scripts/**/*.js'];
  return gulp.src('app/scripts/**/*.js')
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
    .pipe(plugins.concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// gulp.src(src + 'js/*.js')
//       .pipe(plugins.concat('main.js'))
//         .pipe(plugins.rename({suffix: '.min'}))
//         .pipe(plugins.uglify())
//         .pipe(gulp.dest(dest + 'js'));

/**
 * [Compress Images]
 * @param  {[source images]}
 * @return {[dist images]}
 */

gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    // .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});


/**
 * [Clone View Section]
 * @param  {[source html]}
 * @return {[dist html]}
 */

gulp.task('views', function() {
  // Get our index.html
  // gulp.src('app/index.html')
  // And put it in the dist folder
  // .pipe(gulp.dest('dist/'));

  // Any other view files from app/views
  gulp.src('./app/views/**/*')
  // Will be put in the dist/views folder
  .pipe(gulp.dest('dist/views/'))
  .pipe(notify({ message: 'views task complete' }));
});

/**
 * [clean all the things]
 * @param  {[remove all stuff from dist]}
 * @return {[removed all dist stuff and clean]}
 */
gulp.task('clean', function(cb) {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
});

/**
 * [set all task with command grunt]
 * @param  {[type]}
 * @return {[type]}
 * command "gulp"
 */
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images','views');
});


/**
 * [watch changes in files]
 * @param  {[css,js and image path]}
 * @return {[watch activities]}
 * command "gulp watch"
 */

gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('app/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('app/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('app/images/**/*', ['images']);

    // Create LiveReload server
  //livereload.listen();
 
  // Watch any files in dist/, reload on change
  //gulp.watch(['app/**']).on('change', livereload.changed);

});

/** 
 * [script by this start server ]
 * @type {String}
 * command "gulp develop"
 */

gulp.task('develop', function () {
  nodemon({ script: 'server.js', ext: 'html js', ignore: ['ignored.js'] })
    // .on('change', ['lint'])
    .on('restart', function () {
      
      console.log('restarted!');
    });
});

/**
 * ======================STOP===========================
 */
