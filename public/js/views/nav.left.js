/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone view.
 * Left navigation panel.
 */

define(['mt.backbone.sio', 'underscore', 'jquery', 'views/scrollableMixIn'], function(Backbone, _, $, ScrollableMixIn) {
    var NavLeftView = Backbone.View.extend({
        el: '#mt-left-nav-container',
        viewport: '#mt-left-nav-viewport',
        initialize: function(){
            this.initializeScrollable();
        },
        barOptions: {
            railoffset: {left: 12}
        }
    });
    _.extend(NavLeftView.prototype, ScrollableMixIn);
    return NavLeftView;
});
