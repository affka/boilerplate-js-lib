// Load libs and plugins
var gulp = require('gulp');
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var watchify = require('watchify');
var browserify = require('browserify');
var plugins = {
	concat: require('gulp-concat'),
	sourcemaps: require('gulp-sourcemaps'),
	uglify: require('gulp-uglify'),
	minifycss: require('gulp-minify-css'),
	less: require('gulp-less'),
	watchless: require('gulp-watch-less'),
	rename: require('gulp-rename')
};

// Set config
var config = {
	name: 'mylib',
	distPath: 'dist',
	watch: true,
	compress: false
};
gulp.task('config-production', function () {
	config.watch = false;
	config.compress = true;
});

// Libs
gulp.task('lib-dependencies', function () {
	var stream = gulp.src([
		'bower_components/jquery/jquery.js',
		'bower_components/underscore/underscore.js',
		'bower_components/when/es6-shim/Promise.js'
	]);

	stream = stream.pipe(plugins.sourcemaps.init())
		.pipe(plugins.concat('lib-dependencies.js'))
		.pipe(plugins.sourcemaps.write());
	if (config.compress) {
		stream = stream.pipe(plugins.uglify())
	}

	stream.pipe(gulp.dest(config.distPath));
});

// Less
gulp.task('mylib-less', function () {
	gulp.src('src/less/index.less')
		.pipe(plugins.less())
		.pipe(plugins.rename(config.name + '.css'))
		.pipe(gulp.dest(config.distPath));

	if (config.watch) {
		gulp.watch('src/less/*.less', ['less-lib']);
	}
});

// JavaScript
gulp.task('mylib-js', function() {
	var bundleShare = function (b) {
		var stream = b.bundle()
			.pipe(source(config.name + '.js'));
		if (config.compress) {
			stream = stream
				.pipe(buffer())
				.pipe(plugins.uglify());
		}
		stream.pipe(gulp.dest(config.distPath));
	};

	var b = browserify({
		cache: {},
		packageCache: {},
		fullPaths: false
	});

	if (config.watch) {
		b = watchify(b);
		b.on('update', function(){
			bundleShare(b);
		});
	}

	b.add('./src/index.js');
	bundleShare(b);
});

// Grouped tasks for run
var tasks = [
	'lib-dependencies',
	'mylib-less',
	'mylib-js'
];
gulp.task('default', tasks);
gulp.task('production', ['config-production'].concat(tasks));