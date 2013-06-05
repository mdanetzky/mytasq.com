/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['mt.backbone.sio', 'underscore', 'jquery', 'models/tasks', 'models/task', 'views/task'], function(Backbone, _, $, Tasks, Task, TaskView) {

    var TasksView = Backbone.View.extend({
        el: "#tasks",
        newTaskView: null,
        initialize: function() {
            this.eventBus = {};

            _.extend(this.eventBus, Backbone.Events);
            var self = this;
            if (!this.collection) {
                this.collection = new Tasks();
            }
            $(this.el).find('[id|="task"]').each(function() {
                var taskView = new TaskView({el: '#' + $(this).attr('id'), eventBus: self.eventBus});
                self.collection.add(taskView.model);
            });
        },
        createNewTask: function() {
            if (this.collection.get('new')) {
                newTaskView.show();
                newTaskView.focus();
            } else {
                this.$el.prepend('<div id="task-new" class="row-fluid mt.task"></div>');
                var newTask = new Task({id: 'new'});
                newTaskView = new TaskView({el: '#task-new', model: newTask, eventBus: this.eventBus});
                this.collection.add(newTask, {at: 0});
            }
        }
    });

    return TasksView;
});