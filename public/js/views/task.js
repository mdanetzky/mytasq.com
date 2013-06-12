/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['mt.backbone.sio', 'mt.templates', 'models/task', 'mt.editor'], function(Backbone, templates, Task, editor) {

    var TaskView = Backbone.View.extend({
        el: '',
        editMode: false,
        hasChanged: false,
        hasMouseover: false,
        $elementWithFocus: null,
        initialize: function() {
            this.eventBus = this.options.eventBus;
            this.eventBus.on("blur", this.blur, this);
            this.eventBus.on("mouseover", this.mouseout, this);
            if (this.model) {
                // Init task from given model
                this.render();
                this.init$fields();
                this.eventBus.trigger("blur", this);
                this.switchEditable();
                this.$title.focus();
            } else {
                // Init task from html on page
                this.init$fields();
                this.model = new Task({
                    id: this.options.el.split('-').pop(),
                    title: this.$title.html(),
                    text: this.$text.html()
                });
            }
            if (this.model.id === 'new') {
                this.$buttons.css('display', 'none');
                this.$title.html('<div class="mt-title-empty-new-task" style="opacity:0.2;">Enter new task..</div>');
                this.$titleNew = this.$title.find('.mt-title-empty-new-task');
            }
        },
        init$fields: function() {
            this.$title = this.$el.find('.mt-task-title');
            this.$text = this.$el.find('.mt-task-text');
            this.$buttons = this.$el.find('.btn-toolbar');
            this.$editableMask = this.$el.find('.mt-task-edit-mode');
            this.$textEditorToolbar = this.$el.find('.mt-task-text-editor-toolbar');
            this.$textEditorToolbarContainer = this.$el.find('.mt-task-text-editor-toolbar-container');
        },
        events: {
            "click .mt-task": "click",
            "focus .mt-task": "focus",
            "click .mt-btn-task-done": "done",
            "keydown": "keyShortcuts",
            "keypress": "keyShortcuts",
            "keyup": "onChange",
            "mouseover .mt-task": "mouseover",
            "blur .mt-task-title": "blurTitle"
        },
        blurTitle: function(event) {
            // Cleanup title.
            if (this.model.get('title')) {
                this.$title.text(this.$title.text());
            }
        },
        focus: function(event) {
            var self = this;
            var $target = $(event.target);
            var $focusable = $target.closest('.mt-editable, .mt-task');
            if ($focusable.length) {
                if (!$focusable.is(this.$elementWithFocus)) {
                    // Focus has moved to another focusable element
                    this.$elementWithFocus = $focusable;
                    if (this.$text.is($focusable)) {
                        editor.show('text' + this.model.id, this.$text[0], this.$textEditorToolbar, function() {
                            self.click(event);
                        });
                        return false;
                    }
                    if (this.$title.is($focusable)) {
                        if(!this.model.get('title')){
                        // TODO: if title is empty -> move cursor to beginning
                        }
                    }
                }
            }
            return false;
        },
        mouseover: function(event) {
            if (!this.hasMouseover) {
                this.eventBus.trigger('mouseover', this);
                this.hasMouseover = true;
                this.$buttons.stop(true, true);
                this.$buttons.fadeIn('fast');
            }
        },
        mouseout: function(view) {
            if (this.hasMouseover) {
                this.hasMouseover = false;
                this.$buttons.stop(true, true);
                this.$buttons.fadeOut('fast');
            }
        },
        done: function(event) {
            var self = this;
            if (this.model.id !== 'new') {
                this.model.save({"done": true}, {
                    patch: true,
                    success: function(model, response, options) {
                        self.eventBus.trigger('removeTaskFromView', self);
                    },
                    error: function(response) {
                        console.log(response);
                        alert("Task save failed!\ncheck console for details.");
                    }

                });
            }
            return false;
        },
        click: function(event) {
            if (!this.editMode) {
                this.eventBus.trigger("blur", this);
                this.switchEditable();
            }
            this.setFocusOnEditableDiv(event.target);
            // Prevent further bubbling
            return false;
        },
        setFocusOnEditableDiv: function(element) {
            // traverse parents and set focus on element with contenteditable=true
            var $el = $(element);
            $el.closest('[contenteditable="true"]').focus();
        },
        keyShortcuts: function(event) {
            var $target = $(event.target);
            // Remove 'enter new task' text if exists
            if (this.$titleNew) {
                this.$titleNew.remove();
                delete this.$titleNew;
            }
            // Title specific events
            if ($target.closest(this.$title).length) {
                // return, tab -> switch to text field
                if (event.keyCode === 13 || event.keyCode === 9) {
                    if (this.$text.attr('contenteditable') !== 'true') {
                        this.$text.attr('contenteditable', 'true');
                    }
                    this.$text.focus();
                    return false;
                }
            }
            // text specific events
            if ($target.closest(this.$text).length) {
                // tab -> switch to title field
                if (event.keyCode === 9) {
                    this.$title.focus();
                    return false;
                }
            }
        },
        onChange: function(event) {

            // save changed content
            var self = this;
            var $target = $(event.target);
            if ($target.closest(this.$title).length) {
                this.model.set('title', this.$title.text());
            }
            if ($target.closest(this.$text).length) {
                this.model.set('text', editor.getData('text' + this.model.id));
            }
            if (this.model.get('id') === 'new' && !this.hasChanged) {
                if (this.model.isValid()) {
                    this.model.save(null, {
                        patch: true,
                        success: function(model, response, options) {
                            self.model.set('id', '' + response);
                            self.$el.attr('id', 'task-' + self.model.get('id'));
                            self.$buttons.fadeIn();
                        },
                        error: function(response) {
                            console.log(response);
                            alert("Task save failed!\ncheck console for details.");
                        }
                    });
                    return;
                }
            }
            this.hasChanged = true;
            this.model.save(null, {
                deferredSave: true,
                patch: true,
                success: function(model, response, options) {
                },
                error: function(model, response, options) {
                    console.log(response);
                }
            });
        },
        render: function() {
            $(this.el).html(templates("task", {task: this.model.toJSON()}));
            return this;
        },
        switchEditable: function(on) {
            // Stop running animations.
            this.$editableMask.stop(true, true);
            // Default on = true.
            on = (typeof on === 'undefined') ? true : on;
            if (on) {
                this.editMode = true;
                this.$title.attr('contenteditable', 'true');
                if (this.model.get("text")) {
                    this.$text.attr('contenteditable', 'true');
                }
                this.$editableMask.fadeIn(200);
            } else {
                this.editMode = false;
                this.$title.attr('contenteditable', 'false');
                this.$text.attr('contenteditable', 'false');
                this.$editableMask.fadeOut(400);
            }
        },
        blur: function(initiator) {
            if (this.editMode && this !== initiator) {
                if (this.model.get('id') !== 'new') {
                    this.switchEditable(false);
                }
                editor.hide('text' + this.model.id);
                this.$elementWithFocus = null;
            }
        },
        show: function() {
            this.$el.show();
        },
        hide: function() {
            this.$el.hide();
        }
    });

    return TaskView;
});