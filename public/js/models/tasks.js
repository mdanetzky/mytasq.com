/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone Collection.
 * Tasks.
 */

define(['mt.backbone.sio', 'jquery', 'models/task' ], function(Backbone, $, Task){
    var Tasks = Backbone.Collection.extend({
        url: 'task/tasks',
        model: Task,
        initialize: function(){
            
        }
    });
    return Tasks;
});
