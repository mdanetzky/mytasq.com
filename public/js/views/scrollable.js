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
            options: options,
            scrollbars: null,
            currentHeight: 0,
            $el: $(this.el),
            $viewport: $(this.viewport),
            initializeScrollbars: function() {
            },
            resize: function(newHeight) {
                if (typeof newHeight === 'number' && newHeight >= 0) {
                    if (this.currentHeight !== newHeight) {
                        var contentHeight = this.$viewport[0].scrollHeight;
                        var containerHeight = this.$el.outerHeight(false);
                        var heightInset = containerHeight - this.$el.height();
                        var maxHeight = contentHeight + heightInset;
//                        if (this.el === '#mt-left-nav-container') {
//                            console.log('heightInset ' + heightInset);
//                            console.log('containerHeight ' + containerHeight);
//                            console.log('newHeight ' + newHeight);
//                            console.log('contentHeight ' + contentHeight);
//                            console.log('newHeight - heightInset ' + (newHeight - heightInset));
//                        }
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
                        self.scrollbars.scrollstart(function(info) {
//                    console.log(info);
                        });
                        self.scrollbars.scrollend(function(info) {
//                    console.log(info);
                        });
                        if (callback) {
                            callback.apply(ctx);
                        }
                    });
                }
            }
        });
        this.initialize && this.initialize.apply(this, arguments);
    };
    // Make it extendable.
    ScrollableView.extend = Backbone.View.extend;
    return ScrollableView;
});
