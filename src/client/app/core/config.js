(function () {
    'use strict';

    var core = angular.module('app.core');
    
    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }
    
    var config = {
        appErrorPrefix: '[helloworld Error] ',
        app: {
            title: 'DolphStudios',
            subTitle: 'A Realtime Scalable Gaming Application'
        },
        login: {
            authParams: 'openid name email user_id nickname picture app_metadata',
            poweredBy: 'Security Provided By OAuth2',
            loginTitle: 'Sign In Here'
        },
        landing: {
            header: {
                background: 'background: url(/src/client/images/gamer-4-life.png) no-repeat center center;'
            },
            banner: {
                background: 'background: url(/src/client/images/banner-bg.png) no-repeat center center;'
            }
        },
        appDesktopWidth: 768
    };
    core.value('config', config);



    core.config(resoureceConfig);
    /* @ngInject */
    resoureceConfig.$inject = ['$resourceProvider'];
    function resoureceConfig($resourceProvider) {
        // Don't strip trailing slashes from calculated URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;
    };
})();
