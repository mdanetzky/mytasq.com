/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone view.
 * Container in the middle of the screen.
 */

define(['underscore', 'jquery', 'views/scrollable', 'views/tasks'], function(_, $, ScrollableView, TasksView) {
    var MiddleContainerView = ScrollableView.extend({
        el: '#mt-middle-container',
        viewport: '#mt-middle-container',
        taskList: null,
        initialize: function(options) {
            this.options = options;
            this.createTaskListFromHTML('#' + this.$el.attr('id') + ' > [id|="tasks"]');
            this.options.app.on('showDoneByMe', this.showDoneByMe, this);
            this.options.app.on('createTask', this.createTask, this);
        },
        barOptions: {
            railoffset: {left: 8}
        },
        createTaskListFromHTML: function(listElementSelector) {
            var newTaskList = new TasksView({
                el: listElementSelector,
                container: this,
                app: this.options.app
            });
            newTaskList.initializeFromHTML();
            this.taskList = newTaskList;
        },
        showDoneByMe: function() {
            var self = this;
            this.$el.prepend('<div id="tasks-done-by-me" style="position: relative;"></div>');
            var newTaskList = new TasksView({
                el: '#tasks-done-by-me',
                container: this,
                app: this.options.app
            });
            this.taskList.remove();
            newTaskList.fetchFromServer(function(error, resp) {
                if (error) {
                    alert(error);
                } else {
                    self.taskList = newTaskList;
                }
            });
        },
        createTask: function() {
            this.taskList.createNewTask();
            return false;
        }
    });
    return MiddleContainerView;
});