'use strict';

var args = require('yargs').argv;
var config = require('./gulp.config')();
var del = require('del');
var glob = require('glob');
var gulp = require('gulp');
var path = require('path');
var _ = require('lodash');
var $ = require('gulp-load-plugins')({lazy: true});

var port = process.env.PORT || config.defaultPort;

/**
 * Wire-up the bower dependencies
 * @return {Stream}
 */
gulp.task('wiredep', function() {
    console.log('Wiring the bower dependencies into the html...');
    
    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();
    
    // Only include stubs if flag is enabled
    var js = args.stubs ? [].concat(config.js, config.stubsjs) : config.js;
    
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(inject(js, '', config.jsOrder))
        .pipe(gulp.dest(config.client));
});

gulp.task('start', function() {
	$.nodemon(getNodeOptions(true))
        .on('restart', ['wiredep', 'styles']);
});

gulp.task('startProduction', function() {
    $.nodemon(getNodeOptions(false))
        .on('restart', ['wiredep', 'styles']);
});

gulp.task('sass-watcher', function() {
    gulp.watch([config.sass], ['styles']);
});

gulp.task('client-watcher', function() {
    gulp.watch([config.client + '**/*.js'], ['wiredep']);
});

gulp.task('vet', function() {
    return gulp
        .src(config.alljs)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
});

/**
 * Compile less to css
 * @return {Stream}
 */
gulp.task('styles', function() {
    console.log('Compiling SCSS --> CSS');
    
    return gulp
        .src(config.sass)
        .pipe($.flatten())
        .pipe($.sass(config.sassConfig).on('error', $.sass.logError))
        .pipe($.concat('styles.css'))
        .pipe($.plumber())
        .pipe(gulp.dest(config.temp));
});

gulp.task('fonts', function() {
    return gulp
        .src(config.customFonts)
        .pipe($.flatten())
        .pipe($.plumber())
        .pipe(gulp.dest(config.temp));
});


/**
 * Remove all styles from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-styles', function(done) {
    var files = [].concat(
        config.temp + '**/*.css',
        config.build + 'styles/**/*.css'
    );
    clean(files, done);
});

gulp.task('build-dev', ['styles', 'fonts', 'wiredep']);
gulp.task('default', [ 'styles', 'wiredep', 'start', 'sass-watcher', 'client-watcher']); // jshint
gulp.task('prod', [ 'styles', 'wiredep', 'start', 'sass-watcher', 'client-watcher']); // jshint

function getNodeOptions(isDev) {
    return {
        script: config.nodeServer,
        env:{
            'PORT': process.env.PORT || isDev ? config.defaultPort : config.httpsPort,
            'NODE_ENV': isDev ? 'development' : 'production'
        },
        watch: [config.server]
    };
}

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
    console.log('Cleaning: ', path);
    del(path, done);
}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from ' +
        (data.startSize / 1000).toFixed(2) + ' kB to ' +
        (data.endSize / 1000).toFixed(2) + ' kB and is ' +
        formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Log an error message and emit the end of a task
 */
//function errorLogger(error) {
//    log('*** Start of Error ***');
//    log(error);
//    log('*** End of Error ***');
//    this.emit('end');
//}

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}           Formatted perentage
 */
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}

/**
 * Format and return the header for files
 * @return {String}           Formatted file header
 */
function getHeader() {
    var pkg = require('./package.json');
    var template = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @authors <%= pkg.authors %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n');
    return $.header(template, {
        pkg: pkg
    });
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}


/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @returns {Stream}   The stream
 */
function inject(src, label, order) {
    var options = {read: false};
    if (label) {
        options.name = 'inject:' + label;
    }

    return $.inject(orderSrc(src, order), options);
}

/**
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @returns {Stream} The ordered stream
 */
function orderSrc (src, order) {
    //order = order || ['**/*'];
    return gulp
        .src(src)
        .pipe($.if(order, $.order(order)));
}