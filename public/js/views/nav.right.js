/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone view
 * Right navigation panel
 */

define(['jquery', 'views/scrollable'], function($, ScrollableView) {
    
    var NavRightView = ScrollableView.extend({
        el: '#mt-right-nav-container',
        viewport: '#mt-right-nav-container'
    });

    return NavRightView;
});
