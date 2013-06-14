/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone view
 * Left navigation panel
 */

define(['jquery', 'views/scrollable'], function($, ScrollableView) {

    var NavLeftView = ScrollableView.extend({
        el: '#mt-left-nav-container',
        $viewport: $('#mt-left-nav-viewport')
    });

    return NavLeftView;
});
