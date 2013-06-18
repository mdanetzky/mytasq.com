/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone abstract view.
 * Extend it to make content scrollable.
 * Uses nicescroll:
 * https://github.com/inuyaksa/jquery.nicescroll
 */

define(['mt.backbone.sio', 'underscore', 'jquery', 'nicescroll'], function(Backbone, _, $) {
    var ScrollableView = function(options) {
        _.extend(this, {
            scrollbars: null,
            currentHeight: 0,
            $el: $(this.el),
            $viewport: $(this.viewport)
        });
        Backbone.View.apply(this, [options]);
    };
    _.extend(ScrollableView.prototype, Backbone.View.prototype, {
        initialize: function() {
            this.scrollEventBus = {};
            _.extend(this.scrollEventBus, Backbone.Events);
        },
        resize: function(newHeight) {
            if (typeof newHeight === 'number' && newHeight >= 0) {
                if (this.currentHeight !== newHeight) {
                    var contentHeight = this.$viewport[0].scrollHeight;
                    var containerHeight = this.$el.outerHeight(false);
                    var heightInset = containerHeight - this.$el.height();
                    var maxHeight = contentHeight + heightInset;
                    if (contentHeight > (newHeight - heightInset)) {
                        this.currentHeight = newHeight;
                        this.$el.outerHeight(newHeight);
                        this.$viewport.outerHeight(newHeight - heightInset);
                    } else {
                        if (containerHeight !== maxHeight) {
                            this.$el.outerHeight(maxHeight);
                            this.$viewport.outerHeight(maxHeight - heightInset);
                            this.currentHeight = maxHeight;
                        }
                    }
                }
            }
            this.ensureScrollbars();
        },
        remove: function() {
            this.scrollbars.remove();
        },
        ensureScrollbars: function(callback, ctx) {
            var self = this;
            if (this.scrollbars) {
                if (callback) {
                    callback.apply(ctx);
                }
            } else {
                $(function() {
                    var options = {
                        cursoropacitymax: 0.3,
                        cursorborder: '',
                        iframeautoresize: false,
                        spacebarenabled: false,
                        enablekeyboard: false
                    };
                    if (self.barOptions) {
                        _.extend(options, self.barOptions);
                    }
                    self.scrollbars = self.$viewport.niceScroll(options);
                    var scrollHandler = function(info) {
                        var contentHeight = self.$viewport[0].scrollHeight;
                        var containerHeight = self.$el.outerHeight(false);
                        if (((contentHeight - containerHeight) - info.end.y) < 600) {
                            self.trigger('loadNextPage');
                        }
                    };
                    self.scrollbars.scrollstart(scrollHandler);
                    self.scrollbars.scrollend(scrollHandler);
                    if (callback) {
                        callback.apply(ctx);
                    }
                });
            }
        }
    });
    // Make it extendable.
    ScrollableView.extend = Backbone.View.extend;
    return ScrollableView;
});
