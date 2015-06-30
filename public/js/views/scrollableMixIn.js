/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone abstract view.
 * Extend it to make content scrollable.
 * Uses nicescroll:
 * https://github.com/inuyaksa/jquery.nicescroll
 */

define(['underscore', 'jquery', 'nicescroll'], function ( _, $) {

    return {
        scrollbars: null,
        currentHeight: 0,
        initializeScrollable: function() {
            this.$el = $(this.el);
            this.$viewport = $(this.viewport);            
        },
        resize: function (newHeight) {
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
        remove: function () {
            this.scrollbars.remove();
        },
        ensureScrollbars: function (callback, ctx) {
            var self = this;
            if (this.scrollbars) {
                if (callback) {
                    callback.apply(ctx);
                }
            } else {
                $(function () {
                    var options = {
                        cursoropacitymax: 0.3,
                        cursorborder: '',
                        iframeautoresize: false,
                        spacebarenabled: false,
                        enablekeyboard: false,
                        autohidemode: "scroll"
                    };
                    if (self.barOptions) {
                        _.extend(options, self.barOptions);
                    }
                    self.scrollbars = self.$viewport.niceScroll(options);
                    var scrollHandler = function (info) {
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
    };
});
