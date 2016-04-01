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
        file: './bower.json',
        json: require('./bower.json'),
        directory: './bower_components/',
        ignorePath: '../../bower_components/'
    };
    var sassConfig = {
        errLogToConsole: true,
        outputStyle: 'expanded',
        includePaths: [ 'src/client/styles/']
    };
    var sassConfigProd = {
        errLogToConsole: true,
        outputStyle: 'compressed',
        includePaths: [ 'src/client/styles/']
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
        css: clientApp + 'styles.css',
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
        less: client + 'styles/styles.less',
        sass: client + '**/*.scss',
        customFonts: client + '**/*.ttf',
        sassConfig: sassConfig,
        sassConfigProd: sassConfigProd,
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
        production: {
            main: './dist/',
            vendorJs: './.tmp/',
            src: './dist/src/',
            appjs: './dist/*.js',
            index: './dist/index.html',
            bowerIgnorePath: '../bower_components'
        }
    };

    /**
     * wiredep and bower settings
     */
    config.getWiredepDefaultOptions = function(isDev) {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: isDev ? config.bower.ignorePath : config.production.bowerIgnorePath 
        };
        return options;
    };

    config.getInjectOptions = function (isDev) {
        var options = {
            read: false,
            ignorePath: isDev ? '/src/client/' : '/dist/'
        };
        return options;
    };


    return config;
};
