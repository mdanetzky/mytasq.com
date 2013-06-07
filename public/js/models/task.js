/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['mt.backbone.sio'], function(Backbone) {
    var Task = Backbone.Model.extend({
        url: 'task/save',
        id: null,
        title: null,
        text: null,
        validate: function(attrs) {
            if (attrs.title.length === 0
                    && attrs.text.length === 0) {
                return "Task empty";
            }
        }
    });

    return Task;
});
