/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['mt.backbone.sio', 'jquery', 'ckeditor'], function(Backbone, $) {
    this.CKEDITOR.disableAutoInline = true;

    var editors = {};

    return {
        show: function(id, element, $toolbarTarget) {
            var editor = editors[id];
            if (!editor) {
                var options = {};
                editor = CKEDITOR.inline(element, options);


                editor.on('focus', function(event)
                {
                    // Cut out the CK toolbar and move it to task
                    var $toolbar = $('#cke_' + event.editor.name + ' .cke_inner');
                    $toolbarTarget.append($toolbar);
                    
                });
                editors[id] = editor;
            }
        },
        hide: function(element) {

        },
        getData: function(element) {
            var editor = editors.get(element);
            if (editor) {
                return editor.getData();
            }
        }
    };
});
