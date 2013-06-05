/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['mt.backbone.sio'], function(Backbone) {
    var Task = Backbone.Model.extend({
        url: 'task',
        id: null,
        title : null,
        text : null,
        
        validate: function(){
            return this.title || this.text;
        }
    });
    
    return Task;
});
