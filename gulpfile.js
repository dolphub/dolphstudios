'use strict';

var args = require('yargs').argv;
var config = require('./gulp.config')();
var del = require('del');
var glob = require('glob');
var merge2 = require('merge2');
var gulp = require('gulp');
var path = require('path');
var _ = require('lodash');
var rimraf = require('gulp-rimraf');
var fs = require('fs');
var ngAnnotate = require('gulp-ng-annotate');
var $ = require('gulp-load-plugins')({lazy: true});

var env = {
    production: !!$.util.env.production
};


gulp.task('clean-temp', function(done) {
    var files = [].concat(
        config.temp + '**/*.css',
        config.build + 'styles/**/*.css',
        config.temp + '**/*.js'
    );
    clean(files, done);
});

gulp.task('clean-dist', function(cb) {
    return gulp.src(config.production.main)
        .pipe(rimraf());
    // rimraf(config.production.main, cb);
});


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

gulp.task('build-dist-js', function() {
    return gulp
        .src(config.client + '**/*.js')
        .pipe($.sourcemaps.init())
        .pipe($.if(config.jsOrder, $.order(config.jsOrder)))
        .pipe($.concat('all.min.js'))
        .pipe(ngAnnotate({
            add: true
        }))
        .pipe($.bytediff.start())
        // .pipe($.uglify({mangle: false})) // Causes problems
        .pipe($.bytediff.stop())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(config.production.main));
});

gulp.task('build-dist-html', function() {
    return gulp
        .src(config.client + '**/*.html')
        .pipe(gulp.dest(config.production.main));
});

gulp.task('build-dist-images', function() {
    return gulp
        .src(config.client + 'images/*.*')
        .pipe(gulp.dest(config.production.main + 'images'));
});

gulp.task('build-dist', ['build-dist-js', 'build-dist-html', 'build-dist-images']);

/**
 * Watchers
 */
gulp.task('sass-watcher', function() {
    if (!env.production) {
        console.log('Starting Sass Watcher.');
        gulp.watch([config.sass], ['styles']);
    }
});

gulp.task('client-watcher', function() {
    if (!env.production) {
        console.log('Starting Client Watcher.');
        gulp.watch([config.client + '**/*.js'], ['wiredep']);
    }
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
        .pipe($.sass(env.production ? config.sassConfigProd : config.sassConfig).on('error', $.sass.logError))
        .pipe($.concat('styles.css'))
        .pipe($.plumber())
        .pipe(gulp.dest(config.temp));
});



gulp.task('start', function() {
    $.nodemon(env.production ? getNodeOptions(false) : getNodeOptions(true))
        .on('restart', ['wiredep', 'styles']);
});

gulp.task('clean', ['clean-temp', 'clean-dist']);
if (env.production) { // jshint
    gulp.task('build', ['styles', 'build-dist', 'wiredep']);
    gulp.task('serve', ['start']);
} else {
    gulp.task('build', ['styles', 'wiredep']);
    gulp.task('serve', ['start', 'sass-watcher', 'client-watcher']);
}

gulp.task('default', ['clean', 'build', 'serve']);



function getNodeOptions(isDev) {
    return {
        script: config.nodeServer,
        env:{
            'PORT': process.env.PORT || config.defaultPort,
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
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @returns {Stream}   The stream
 */
function inject(src, label, order) {
    var options = config.getInjectOptions();
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