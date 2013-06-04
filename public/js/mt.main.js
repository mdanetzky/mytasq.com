/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Client main entry point
 */

define(['jquery', 'mt.socket', 'mt.backbone.app', 'mt.spinner'], function($, socket, AppView, activity) {
// init all handlers

    var appView;
    return {
        init: function() {
            $(document).ready(function() {
                appView = new AppView({socket: socket});
                activity.hide();
                $('#content').fadeIn("fast");
            });
        }
    };
});
