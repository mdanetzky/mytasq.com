/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['mt.backbone.sio', 'jquery', 'models/tasks', 'views/task'], function(Backbone, $, Tasks, TaskView){
    
    var TasksView = Backbone.View.extend({
        el: "#tasks",
        initialize: function(){
            var self = this;
            if(!this.collection){
                this.collection = new Tasks();
            }
            $('[id|="task"]').each(function(){
                var taskView = new TaskView({el: '#' + $(this).attr('id')});
                self.collection.add(taskView.model);
            });
            console.log(this.collection);
        }
    });
    
    return TasksView;
});