/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone view.
 * Right navigation panel.
 */

define(['mt.backbone.sio', 'underscore', 'jquery', 'views/scrollableMixIn'], function(Backbone, _, $, ScrollableMixIn) {
    var NavRightView = Backbone.View.extend({
        el: '#mt-right-nav-container',
        viewport: '#mt-right-nav-container',
        initialize: function() {
            this.initializeScrollable();
        }
    });
    _.extend(NavRightView.prototype, ScrollableMixIn);
    return NavRightView;
});
