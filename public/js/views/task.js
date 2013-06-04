/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['mt.backbone.sio', 'models/task'], function(Backbone, Task){
    
    var TaskView = Backbone.View.extend({
        el: "#task" + this.model.id,
        events: {
           "dblclick" : "doubleclick" 
        },
        doubleclick : function(event){
            alert(event);
        }
    });
    
    return TaskView;
});