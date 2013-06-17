/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['mt.backbone.sio', 'underscore', 'mt.util', 'jquery', 'mt.spinner', 'mt.message.box'], function(Backbone, _, util, $, activity, msgBox) {
    var UserLogout = Backbone.View.extend({
        el: "#userLogout",
        events: {
            "click #userLogoutSend": "logoutSend"
        },
        logoutSend: function() {
            activity.show();
            this.socket.emit("backbone.sync", {
                url: "user/logout"
            }, function(err, response) {
                activity.hide();
                if (err) {
                    msgBox(err);
                } else {
                    document.location.href = "/";
                }
            });
        }
    });
    return UserLogout;
});