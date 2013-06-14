/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone tasks collection
 */

define(['mt.backbone.sio', 'jquery', 'models/task' ], function(Backbone, $, Task){
    
    var Tasks = Backbone.Collection.extend({
        model: Task,
        initialize: function(){
            
        }
    });
    
    return Tasks;
});
