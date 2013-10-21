/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Bootstrap view.
 * Top navigation panel.
 */

define(['mt.backbone.sio', 'jquery'], function (Backbone, $) {
    var NavTopView = Backbone.View.extend({
        el: '#mt-navbar',
        initialize: function (options) {
            this.options = options;
        },
        events: {
            "click #mt-nav-done-by-me": "tasksDoneByMe",
            "click #new_task": "createTask"
        },
        tasksDoneByMe: function () {
            this.options.app.trigger('showDoneByMe');
            $('.dropdown.open .dropdown-toggle').dropdown('toggle');
            return false;
        },
        createTask: function () {
            this.options.app.trigger('createTask');
            return false;
        }
    });
    return NavTopView;
});