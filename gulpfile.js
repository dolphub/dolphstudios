var args = require('yargs').argv;
var config = require('./gulp.config')();
var del = require('del');
var glob = require('glob');
var useref = require('gulp-useref');
var lazypipe = require('lazypipe');
var gulp = require('gulp');
var _ = require('lodash');
var ngAnnotate = require('gulp-ng-annotate');
var $ = require('gulp-load-plugins')({lazy: true});

var colors = $.util.colors;
var env = {
    production: !!$.util.env.production,
    staging: !!$.util.env.staging
};

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);



/**
 * Watchers
 */
gulp.task('sass-watcher', function() {
    console.log('Starting Sass Watcher.');
    gulp.watch([config.sass], ['styles']);
});

gulp.task('client-watcher', function() {
    console.log('Starting Client Watcher.');
    gulp.watch([config.client + '**/*.js'], ['wiredep']);
});

/**
 * Compile sass to css
 * @return {Stream}
 */
gulp.task('styles', ['clean-styles'], function() {
    console.log('Compiling SCSS --> CSS and concating to one file');

    return gulp
        .src(config.sass)
        .pipe($.flatten())
        .pipe($.sass(config.getSassConfig()).on('error', $.sass.logError))
        .pipe($.concat('styles.css'))
        .pipe($.plumber())
        .pipe(gulp.dest(config.temp));
});

gulp.task('images', ['clean-images'], function() {
    return gulp
        .src(config.images)
        .pipe($.if(args.verbose, $.bytediff.start()))
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe($.if(args.verbose, $.bytediff.stop(bytediffFormatter)))
        .pipe(gulp.dest(config.build.images));
});

/**
 * Wire-up the bower dependencies
 * @return {Stream}
 */
gulp.task('wiredep', function() {
    log('Wiring the bower dependencies into the html');

    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();

    // Only include stubs if flag is enabled
    var js = args.stubs ? [].concat(config.js, config.stubsjs) : config.js;
    var css = [].concat(config.appCss);

    console.log(css);

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(inject(js, '', config.jsOrder))
        .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['styles', 'wiredep'], function() {
    var css = [].concat(config.css); // Add specific generated files here
    gulp.src(config.index)
        .pipe(inject(css))
        .pipe(gulp.dest(config.client));
});

gulp.task('optimize', ['inject'], function() {

    // TODO: lazypipes work, use to minify app.js and lib.js
    var cssPipe = lazypipe()
        .pipe($.minifyCss);

    // TODO:  Filter's don't seem to be working
    gulp.src(config.index)
        .pipe($.plumber())
        .pipe(useref())
        .pipe($.if('*.css', cssPipe()))
        .pipe(gulp.dest(config.build.path));


        //       .pipe(jsAppFilter)
        // .pipe($.ngAnnotate({add: true}))
        // .pipe($.uglify())
        // .pipe(getHeader())
        // .pipe(jsAppFilter.restore)

});




/*FIX ME >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

gulp.task('build-build-js', function() {
    // TODO: all.min.js Bower Dependancy minifications
    // return gulp
    //     .src(config.client + '**/*.js')
    //     .pipe($.sourcemaps.init())
    //     .pipe($.if(config.jsOrder, $.order(config.jsOrder)))
    //     .pipe($.concat('all.min.js'))
    //     .pipe($.bytediff.start())
    //     .pipe(ngAnnotate({
    //         add: true
    //     }))
    //     .pipe($.uglify({mangle: false})) // mangle: true Causes problems
    //     .pipe($.bytediff.stop(bytediffFormatter))
    //     .pipe(getHeader())
    //     .pipe($.sourcemaps.write('./'))
    //     .pipe(gulp.dest(config.production.main));
});

gulp.task('build-html', ['wiredep'], function() {
    // return gulp
    //     .src(config.client + '**/*.html')
    //     .pipe(gulp.dest(config.production.main));
});

gulp.task('bundle', function() {
    // TODO:  Finish bundle task, minify vendor and package
});

// gulp.task('build-build', ['build-build-html', 'build-build-images']);


gulp.task('start', function() {
    $.nodemon(getNodeOptions(!env.productio3n))
        .on('restart', ['wiredep', 'sass']);
});

if (env.production) { // jshint
    gulp.task('build', ['styles', 'build-build']);
    gulp.task('serve', ['start']);
} else { 
    gulp.task('build', ['styles', 'wiredep']);
    gulp.task('serve', ['start', 'sass-watcher', 'client-watcher']);
}

// gulp.task('default', ['clean', 'build', 'serve']);
/*FIX ME <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

/**
 * Clean styles
 */
gulp.task('clean-styles', function() {
    var files = [].concat(
        config.temp + '**/*.css'
    );
    return clean(files);
});

/**
 * Clean images
 */
gulp.task('clean-images', function() {
    var files = [].concat(
        config.build.images + '**/*.*'
    );
    return clean(files);
});

gulp.task('clean-build', function() {
    var files = [].concat(config.build.path);
    return clean(files);
});

gulp.task('clean', ['clean-styles', 'clean-build']);

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
function clean(path) {
    console.log('Cleaning: ' + $.util.colors.blue(path));
    return del(path);
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
    var options = config.getInjectOptions(!env.production);
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
function orderSrc(src, order) {
    //order = order || ['**/*'];
    return gulp
        .src(src)
        .pipe($.if(order, $.order(order)));
}

module.exports = gulp;