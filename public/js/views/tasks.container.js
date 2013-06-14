/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone view
 * Container of all task lists
 */

define(['jquery', 'views/scrollable'], function($, ScrollableView) {

    var TasksContainerView = ScrollableView.extend({
        el: '#mt-tasks-list-container',
        $viewport: $('#mt-tasks-list-viewport')
    });

    return TasksContainerView;
});