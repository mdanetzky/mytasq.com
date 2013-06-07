/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['mt.backbone.sio', 'mt.templates', 'models/task'], function(Backbone, templates, Task) {

    var TaskView = Backbone.View.extend({
        el: '',
        editMode: false,
        hasChanged: false,
        initialize: function() {
            this.eventBus = this.options.eventBus;
            this.eventBus.on("blur", this.blur, this);
            if (this.model) {
                this.render();
                this.init$fields();
                this.eventBus.trigger("blur", this);
                this.switchEditable();
                this.$title.focus();
            } else {
                this.init$fields();
                this.model = new Task({
                    id: this.options.el.split('-').pop(),
                    title: this.$title.html(),
                    text: this.$text.html()
                });
            }
        },
        init$fields: function() {
            this.$title = this.$el.find('.mt-task-title');
            this.$text = this.$el.find('.mt-task-text');
        },
        events: {
            "click": "click",
            "keydown": "keyShotcuts",
            "keypress": "keyShotcuts",
            "keyup": "onChange"
        },
        click: function(event) {
            if (!this.editMode) {
                this.eventBus.trigger("blur", this);
                this.switchEditable();
            }
            this.setFocusOnEditableDiv(event.target);
        },
        setFocusOnEditableDiv: function(element) {
            if (element !== document) {
                if (element.getAttribute('contenteditable') === 'true') {
                    element.focus();
                } else {
                    this.setFocusOnEditableDiv(element.parentNode);
                }
            }
        },
        keyShotcuts: function(event) {
            // title specific events
            if ((event.target.className.indexOf('mt-task-title') > -1)
                    || ($(event.target).parents('.mt-task-title').length !== 0)) {
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
            if ((event.target.className.indexOf('mt-task-text') > -1)
                    || ($(event.target).parents('.mt-task-text').length !== 0)) {
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
            this.model.set('title', this.$title.html());
            this.model.set('text', this.$text.html());
            if (this.model.get('id') === 'new' && !this.hasChanged) {
                if (this.model.isValid()) {
                    this.model.save(null, {
                        success: function(model, response, options) {
                            self.model.set('id', '' + response);
                            self.$el.attr('id', 'task-' + self.model.get('id'));
                        }, error: function(response) {
                            console.log(response);
                            alert("Task save failed!\ncheck console for details.");
                        }
                    });
                    return;
                }
            }
            this.hasChanged = true;
            this.model.save(null, {
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
            // stop running animations
            this.$title.stop(true, false);
            this.$text.stop(true, false);
            if (typeof on === 'undefined') {
                on = true;
            }
            if (on) {
                this.editMode = true;
                this.$title.attr('contenteditable', 'true');
                if (this.model.get("text")) {
                    this.$text.attr('contenteditable', 'true');
                }
                $(this.el).find('.mt-task-edit-mode').fadeIn(200);
            } else {
                this.editMode = false;
                this.$title.attr('contenteditable', 'false');
                this.$text.attr('contenteditable', 'false');
                $(this.el).find('.mt-task-edit-mode').fadeOut(400);
            }
        },
        blur: function(initiator) {
            if (this.editMode && this !== initiator) {
                if (this.model.get('id') !== 'new') {
                    this.switchEditable(false);
                }
            }
        },
        focus: function() {
            this.eventBus.trigger("blur", this);
            this.switchEditable();
            this.$title.focus();
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