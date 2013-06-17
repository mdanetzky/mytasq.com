/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone view.
 * Container of all task lists.
 */

define(['underscore', 'jquery', 'views/scrollable', 'views/tasks'], function(_, $, ScrollableView, TasksView) {
    var MiddleContainerView = ScrollableView.extend({
        el: '#mt-middle-container',
        viewport: '#mt-middle-container',
        taskList: null,
        initialize: function() {
            this.createTaskListFromHTML('#tasks');
            this.options.app.on('showDoneByMe', this.showDoneByMe, this);
            this.options.app.on('createTask', this.createTask, this);
        },
        barOptions: {
            railoffset: {left: 12}
        },
        createTaskListFromHTML: function(listElementSelector) {
            var newTaskList = new TasksView({
                el: listElementSelector
            });
            newTaskList.initializeFromHTML();
            this.taskList = newTaskList;
        },
        showDoneByMe: function() {
            var self = this;
            this.$el.prepend('<div id="tasks-done-by-me" style="position: relative;"></div>');
            var newTaskList = new TasksView({
                el: '#tasks-done-by-me'
            });
            this.taskList.remove();
            newTaskList.fetchFromServer({query: {name: 'tasks-done-by-me'}}, function(error, resp) {
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