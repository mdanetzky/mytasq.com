/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['mt.backbone.sio', 'models/task'], function(Backbone, Task){
    
    var TaskView = Backbone.View.extend({
        initialize: function(){
            if(!this.options.model) {
                this.model = new Task({
                    id: this.options.el.split('-').pop(),
                    title: $(this.options.el).find('.mt-task-title').html(),
                    text: $(this.options.el).find('.mt-task-text').html()
                });
            } else {
                this.el = "#task-" + options.model.id;
                this.render();
            }
        },
        events: {
           "dblclick" : "doubleclick" 
        },
        doubleclick : function(event){
            alert(event);
        }
    });
    
    return TaskView;
});