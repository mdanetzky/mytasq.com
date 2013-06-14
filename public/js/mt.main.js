/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Client main entry point
 */

define(['jquery', 'mt.socket', 'mt.backbone.app', 'mt.spinner', 'jquery-ui'], function($, socket, AppView, activity) {
    var app;
    return {
        init: function() {
            // Init Backbone App.
            app = new AppView({socket: socket});
            // Show page after it is rendered.
            $(document).ready(function() {
                activity.hide();
//                $('#content').fadeIn('fast');
//                $('#content').animate( {
//                    opacity:1
//                }, 'fast');
            });
        }
    };
});
