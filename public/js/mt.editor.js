/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * CKEditor wrapper.
 */

define(['mt.backbone.sio', 'jquery', 'mt.util', 'ckeditor'], function (Backbone, $, util) {
    this.CKEDITOR.disableAutoInline = true;
    var editors = {};
    return {
        init: function (id, element, $toolbarTarget, callback) {
            var options = {},
                editor = {};
            editor.ck = CKEDITOR.inline(element, options);
            editor.$toolbarTarget = $toolbarTarget;
            editor.ck.on('focus', function (event) {
                // Cut out the CK toolbar and move it to task.
                var $toolbar = $('#cke_' + event.editor.name + ' .cke_inner');
                editor.$toolbarTarget.append($toolbar);
                //self.swingIn(editor);
                util.swingInFromTop(editor.$toolbarTarget.parent());
                if (callback) {
                    callback();
                }
            });
            editors[id] = editor;
            return editor;
        },
        show: function (id, element, $toolbarTarget, callback) {
            var self = this;
            var editor = editors[id];
            if (!editor) {
                editor = this.init(id, element, $toolbarTarget, callback);
            } else {
                clearTimeout(editor.destroyTimeout);
                if (!editor.isVisible) {
                    editor.$toolbarTarget.parent().stop(true, true);
                    self.swingIn(editor, callback);
                    if (callback) {
                        callback();
                    }
                }
            }
            editor.isVisible = true;
        },
        swingIn: function (editor) {
            // Toolbar: Slide in from top.
            var toolbarHeight = editor.$toolbarTarget.outerHeight(true);
            editor.$toolbarTarget.parent().animate({
                height: toolbarHeight,
                "margin-bottom": 10
            }, 'fast', 'swing', function () {
                editor.$toolbarTarget.parent().css('height', '');
            });
        },
        hide: function (id) {
            var editor = editors[id];
            if (editor && editor.isVisible) {
                editor.$toolbarTarget.parent().stop(true, true);
                util.swingOutToTop(editor.$toolbarTarget.parent());
                editor.isVisible = false;
                // Destroy unused editor instances 30 seconds after hide.
                var self = this;
                editor.destroyTimeout = setTimeout(function () {
                    self.destroy(id);
                }, 30000);
            }
        },
        getData: function (id) {
            var editor = editors[id];
            if (editor) {
                return editor.ck.getData();
            }
        },
        destroy: function (id) {
            var editor = editors[id];
            if (editor) {
                clearTimeout(editor.destroyTimeout);
                editor.ck.destroy();
                editor.$toolbarTarget.empty();
                delete editors[id];
            }
        }
    };
});