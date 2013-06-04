/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['mt.backbone.sio'], function(Backbone) {
    var Task = Backbone.Model.extend({
        
        url: 'task',
        
        title : null,
        text : null
    });
    
    return Task;
});
