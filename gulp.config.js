module.exports = function() {
    var client = './src/client/';
    var server = './src/server/';
    var clientApp = client + 'app/';
    var root = './';
    var specRunnerFile = 'specs.html';
    var temp = './.tmp/';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({devDependencies: false})['js'];
    var bower = {
        json: require('./bower.json'),
        directory: './bower_components/',
        ignorePath: '../../bower_components/'
    };
    var nodeModules = 'node_modules';

    var config = {
        /**
         * File paths
         */
        // all javascript that we want to vet
        alljs: [
            './src/**/*.js',
            './*.js'
        ],
        build: './build/',
        client: client,
        css: temp + 'styles.css',
        fonts: bower.directory + 'font-awesome/fonts/**/*.*',
        html: client + '**/*.html',
        htmltemplates: clientApp + '**/*.html',
        images: client + 'images/**/*.*',
        index: client + 'index.html',
        // app js, with no specs
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        jsOrder: [
            '**/app.module.js',
            '**/*.module.js',
            '**/*.js'
        ],
        sass: client + '**/*.scss',
        root: root,
        server: server,
        source: 'src/',
        stubsjs: [
            bower.directory + 'angular-mocks/angular-mocks.js',
            client + 'stubs/**/*.js'
        ],
        temp: temp,

        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },

        /**
         * browser sync
         */
        browserReloadDelay: 1000,

        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                root: 'app/',
                standalone: false
            }
        },

        /**
         * Bower and NPM files
         */
        bower: bower,
        packages: [
            './package.json',
            './bower.json'
        ],

        /**
         * Node settings
         */
        nodeServer: server + 'app.js',
        defaultPort: '3001',
        build: {
            path: './build/',
            images: './build/images/',
            src: './build/src/',
            appjs: './build/*.js',
            index: './build/index.html',
            bowerIgnorePath: '../bower_components'
        }
    };

    /**
     * wiredep and bower settings
     */
    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath 
        };
        return options;
    };

    config.getInjectOptions = function (isDev) {
        var options = {
            read: false,
            ignorePath: [
                isDev ? '/src/client/' : '/build/',
                '/.tmp/'
            ]
        };
        return options;
    };

    config.getSassConfig = function(isDev) {
        var options = {
            errLogToConsole: true,
            outputStyle: isDev ? 'expanded' : 'compressed',
            includePaths: [ 'src/client/styles/']
        };
        return options;
    }


    return config;
};
