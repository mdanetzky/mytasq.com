/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['backbone.sio', 'models/task'], function(Backbone, Task){
    
    var TaskView = Backbone.View.extend({
        el: "#task" + this.model.id,
        
    });
    
    return TaskView;
});