/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Requirejs config and startup.
 */

(function() {
    var mtRequire = require.config({
        baseUrl: 'js',
        paths: {
            "jquery": 'lib/jquery-1.10.1.full',
            "jquery-ui": 'lib/jquery-ui.min',
            "text": 'lib/require/text',
            "async": 'lib/require/async',
            "backbone": 'lib/backbone',
            "underscore": 'lib/underscore',
            "spin": "lib/spin",
            "transit": "lib/transit.min",
            "bootstrap": 'lib/bootstrap.min',
            "socket.io": '/socket.io/socket.io',
            "uri.parser" : "lib/uri.parser",
            "ckeditor" : "lib/ckeditor/ckeditor",
            "nicescroll" : "lib/jquery.nicescroll"
        },
        map: {
            '*': {
                'css': 'lib/require/require-css/css'
            }
        },
        shim: {
            "socket.io": {
                exports: 'io'
            },
            "nicescroll": {
                deps: ['jquery']
            },
            "activity-indicator": {
                deps: ['jquery']
            },
            "jquery": {
                exports: '$'
            },
            "jquery-ui": {
                deps: ['jquery']
            },
            "underscore": {
                exports: '_'
            },
            "backbone": {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            "bootstrap": {
                deps: ['jquery']
            }
        }
    });

    mtRequire(['mt.spinner'], function(activity) {
        activity.show();
        mtRequire(['mt.main', 'bootstrap'], function(mtMain) {
            mtMain.init();
        });
    });
})();