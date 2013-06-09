/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Tasks View
 */

define(['mt.backbone.sio', 'underscore', 'jquery', 'models/tasks', 'models/task', 'views/task'], function(Backbone, _, $, Tasks, Task, TaskView) {

    var TasksView = Backbone.View.extend({
        el: "#tasks",
        newTaskView: null,
        initialize: function() {

            // create event bus
            this.eventBus = {};
            _.extend(this.eventBus, Backbone.Events);
            this.eventBus.on("removeTaskFromView", this.removeTaskFromView, this);
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
        },
        removeTaskFromView: function(taskView) {
            var self = this;
            if (taskView && taskView.model && taskView.model.id) {
                var $task = this.$el.find('#task-' + taskView.model.id);
                var fadeOutTask = function() {
                    $task.css('overflow', 'hidden');
                    $task.animate({height: 0}, function() {
                        // cleanup
                        self.collection.remove(taskView.model);
                        taskView.remove();
                        delete taskView.model;
                        delete taskView;
                        $task.remove();
                    });
                    $task.fadeOut(200);
                };
                if ($task.length) {
                    var $editMode = $task.find('.mt-task-edit-mode');
                    if ($editMode.is(":visible")) {
                        $editMode.fadeOut(100, fadeOutTask);
                    } else {
                        fadeOutTask();
                    }
                }
            }
        }
    });

    return TasksView;
});