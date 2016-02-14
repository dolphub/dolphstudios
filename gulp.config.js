module.exports = function() {
    var client = './src/client/';
    var server = './src/server/';
    var clientApp = client + 'app/';
    var root = './';
    var specRunnerFile = 'specs.html';
    var temp = './.tmp/';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({devDependencies: true})['js'];
    var bower = {
        json: require('./bower.json'),
        directory: './bower_components/',
        ignorePath: '../..'
    };
    var sassConfig = {
        errLogToConsole: true,
        outputStyle: 'expanded'
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
         * The sequence of the injections into specs.html:
         *  1 testlibraries
         *      mocha setup
         *  2 bower
         *  3 js
         *  4 spechelpers
         *  5 specs
         *  6 templates
         */
        testlibraries: [
            nodeModules + '/mocha/mocha.js',
            nodeModules + '/chai/chai.js',
            nodeModules + '/sinon-chai/lib/sinon-chai.js'
        ],
        specHelpers: [client + 'test-helpers/*.js'],
        specs: [clientApp + '**/*.spec.js'],
        serverIntegrationSpecs: [client + '/tests/server-integration/**/*.spec.js'],

        /**
         * Node settings
         */
        nodeServer: server + 'app.js',
        defaultPort: '3001'
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


    return config;
};
