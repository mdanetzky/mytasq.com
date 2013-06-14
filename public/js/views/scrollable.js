/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone abstract view.
 * Extend it to make content scrollable.
 * Uses nicescroll:
 * https://github.com/inuyaksa/jquery.nicescroll
 */

define(['mt.backbone.sio', 'underscore', 'jquery'], function(Backbone, _, $) {

    var ScrollableView = function() {
        _.extend(this, {
            scrollbars: null,
            currentHeight: 0,
            $el: $(this.el),
            initializeScrollbars: function() {
            },
            resize: function(newHeight) {
                if (typeof newHeight === 'number' && newHeight >= 0) {
                    if (this.currentHeight !== newHeight) {
                        var contentHeight = this.$content.outerHeight(true);
                        var viewportHeight = this.$el.outerHeight(true);
                        var heightInset = viewportHeight - this.$viewport.height();
                        var maxHeight = contentHeight + heightInset;
                        if (contentHeight > (newHeight - heightInset)) {
                            this.currentHeight = newHeight;
                            this.$el.outerHeight(newHeight);
                            this.scrollbars.resize();
                        } else {
                            if (viewportHeight !== maxHeight) {
                                this.$el.outerHeight(maxHeight);
                                this.currentHeight = maxHeight;
                            }
                        }
                    }
                }
            }
        });

        // Initialization
        this.scrollbars = this.$viewport.niceScroll({cursorcolor: "#ddd"});
        this.$viewport.wrapInner('<div style="overflow:hidden" />');
        this.$content = this.$viewport.find(':first-child');
        this.heightInset = this.$el.outerHeight(true) - this.$viewport.height();
        this.initializeScrollbars();
        // Call child's initialization method
        this.initialize && this.initialize.apply(this, arguments);
    };

    // Make extendable
    ScrollableView.extend = Backbone.View.extend;

    return ScrollableView;
});
