/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone View.
 * Tasks list.
 */

define(['mt.backbone.sio', 'underscore', 'jquery', 'models/tasks', 'models/task', 'views/task', 'mt.spinner'], function(Backbone, _, $, Tasks, Task, TaskView, activity) {
    var TasksView = Backbone.View.extend({
        el: '',
        loadingData: false,
        query: null,
        allDataLoaded: false,
        initialize: function(options) {
            this.options = options;
            this.on('removeTaskFromView', this.removeTaskFromView, this);
            this.options.container.on('loadNextPage', this.loadNextPage, this);
            if (!this.collection) {
                this.collection = new Tasks();
            }
            this.query = {
                name: this.$el.attr('id'),
                page: 0
            };
            if (this.query.name.indexOf('tasks-of-task-') === 0) {
                this.parentTaskId = this.query.name.split('-').pop();
                this.query.name = 'tasks-of-task';
                this.query.parentTaskId = this.parentTaskId;
            }
        },
        initializeFromHTML: function() {
            var self = this;
            this.$el.find('[id|="task"]').each(function() {
                var taskView = new TaskView({
                    el: '#' + $(this).attr('id'),
                    taskList: self,
                    container: self.options.container,
                    app: self.options.app
                });
                self.collection.add(taskView.model);
            });
        },
        loadNextPage: function() {
            if (!this.loadingData && !this.allDataLoaded) {
                this.query.page++;
                this.fetchFromServer();
            }
        },
        fetchFromServer: function(callback) {
            if (!this.loadingData) {
                this.loadingData = true;
                activity.show();
                var self = this;
                var options = {
                    query: this.query
                };
                this.collection = this.collection || new Tasks();
                var newTasks = new Tasks();
                options.success = function(collection, response, options) {
                    if (collection.length === 0) {
                        self.allDataLoaded = true;
                    } else {
                        collection.each(function(task) {
                            self.$el.append('<div id="task-' + task.id + '" class="row-fluid">');
                            new TaskView({
                                el: '#task-' + task.id,
                                model: task,
                                taskList: self,
                                container: self.options.container,
                                app: self.options.app
                            });
                            self.collection.add(task);
                        });
                    }
                    if (callback) {
                        callback(null, 'OK');
                    }
                    activity.hide();
                    self.loadingData = false;
                };
                options.error = function(collection, response, options) {
                    if (callback) {
                        callback(response);
                    }
                    activity.hide();
                    self.loadingData = false;
                };
                newTasks.fetch(options);
            }
        },
        createNewTask: function() {
            if (this.collection.get('new')) {
                this.newTaskView.show();
                this.newTaskView.focus();
            } else {
                // New task element id must be unique document wide.
                var newTaskElId = this.$el.attr('id') + 'task-new';
                this.$el.prepend('<div id="' + newTaskElId + '" class="row-fluid mt.task"></div>');
                var newTask = new Task({id: 'new'});
                if (this.parentTaskId) {
                    newTask.set('parentTask', this.parentTaskId);
                }
                this.newTaskView = new TaskView({
                    el: '#' + newTaskElId,
                    model: newTask,
                    taskList: this,
                    container: this.options.container,
                    app: this.options.app
                });
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