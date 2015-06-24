'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

gulp.task('javascript', function () {
	// set up the browserify instance on a task basis
	var b = browserify({
		debug: true
	});
	b.require('./src/index.js', {expose: 'candombe'});
	b.require('underscore');

	return b.bundle()
		.pipe(source('candombe.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
				// Add transformation tasks to the pipeline here.
				// .pipe(uglify())
				.on('error', gutil.log)
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/js/'));
});



// browserify({entries: './src/index.js'}).bundle() but then I load the generated script in a html doc
