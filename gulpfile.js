var gulp = require('gulp'),
	gUtil = require('gulp-util'),
	compass = require('gulp-compass'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	clean = require('gulp-clean'),
	notify = require('gulp-notify'),
	chalk = require('chalk'),
	summary = require('jshint-summary'),
	browserify = require('gulp-browserify'),

	pkg = require('./package.json');

/********************************
 *	JsLint task
 * 	Uses the predefined variables set in the jshintrc file
 *	located at the root of the project
 ********************************/
gulp.task('lint', function () {
	return gulp.src(['js/*.js'])
			.pipe(jshint('.jshintrc'));
});

gulp.task('default', ['scripts', 'styles']);

/********************************
 *	Browserify's the main.js file
 *	jquery/underscore/BB/Mustache exported to global
 ********************************/
gulp.task('scripts', function () {
	return gulp.src('js/main.js', {read: false})
		.pipe(browserify({
			debug: true,
			shim: {
				jquery: {
					path: 'bower_components/jquery/dist/jquery.js',
					exports: '$'
				},
				underscore: {
					path: 'bower_components/underscore/underscore.js',
					exports: '_'
				},
				Backbone: {
					path: 'bower_components/backbone/backbone.js',
					exports: 'Backbone',
					depends: {
						underscore: '_',
						jquery: '$'
					}
				},
				Mustache: {
					path: 'bower_components/mustache/mustache.js',
					exports: 'Mustache',
					depends: {}
				}
			}
		}))
		.on('error', gUtil.log)
		.pipe(gulp.dest('min/'));
});

/********************************
 *	Converts scss -> compass -> autoprefixr -> min'd.css
 ********************************/
gulp.task('styles', function () {
	return gulp.src('sass/core.scss')
		.pipe(compass({
			config_file: './config.rb',
			css: 'stylesheets',
			comments: 'false'
		}))
		.on('error', gUtil.log)
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.on('error', gUtil.log)
		.pipe(minifycss())
		.pipe(gulp.dest('min'));
});

/********************************
 *	Clean out the min folder
 ********************************/
gulp.task('clean', function () {
	return gulp.src(['min/*.*'], {read: false})
		.pipe(clean());
});

/********************************
 *	Main gulp task
 *	Watches for changes to the main files and re-runs the appr task
 ********************************/
gulp.task('watch', ['clean', 'styles', 'scripts'], function () {
	gulp.watch('sass/core.scss', ['styles']);
	gulp.watch('js/*.js', ['lint','scripts']);
	// gulp.watch('test/**/*.js', ['test-bfy', 'test']);
});