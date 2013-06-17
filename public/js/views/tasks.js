/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Tasks View
 */

define(['mt.backbone.sio', 'underscore', 'jquery', 'models/tasks', 'models/task', 'views/task'], function(Backbone, _, $, Tasks, Task, TaskView) {
    var TasksView = Backbone.View.extend({
        el: '',
        newTaskView: null,
        initialize: function() {
            this.on("removeTaskFromView", this.removeTaskFromView, this);
            if (!this.collection) {
                this.collection = new Tasks();
            }
        },
        initializeFromHTML: function() {
            var self = this;
            $(this.el).find('[id|="task"]').each(function() {
                var taskView = new TaskView({el: '#' + $(this).attr('id'), taskList: self});
                self.collection.add(taskView.model);
            });
        },
        fetchFromServer: function(options, callback) {
            var self = this;
            var options = options || {};
            this.collection = this.collection || new Tasks();
            var newTasks = new Tasks();
            options.success = function(collection, response, options) {
                collection.each(function(task) {
                    self.$el.append('<div id="task-' + task.id + '" class="row-fluid">');
                    new TaskView({el: '#task-' + task.id, model: task, taskList: self});
                    self.collection.add(task);
                });
                callback(null, 'OK');
            };
            options.error = function(collection, response, options) {
                callback(response);
            };
            newTasks.fetch(options);
        },
        createNewTask: function() {
            if (this.collection.get('new')) {
                this.newTaskView.show();
                this.newTaskView.focus();
            } else {
                this.$el.prepend('<div id="task-new" class="row-fluid mt.task"></div>');
                var newTask = new Task({id: 'new'});
                this.newTaskView = new TaskView({el: '#task-new', model: newTask, taskList: this});
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