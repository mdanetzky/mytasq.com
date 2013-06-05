/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['mt.backbone.sio', 'mt.templates', 'models/task'], function(Backbone, templates, Task) {

    var TaskView = Backbone.View.extend({
        el: '',
        title: '.mt-task-title',
        text: '.mt-task-text',
        editMode: false,
        hasChanged: false,
        initialize: function() {
            this.eventBus = this.options.eventBus;
            this.eventBus.on("blur", this.blur, this);
            if (this.options.model) {
                this.model = this.options.model;
                if (this.model.get('id') === 'new') {
                    this.render();
                    this.eventBus.trigger("blur", this);
                    this.switchEditable();
                    $(this.el).find(this.title).focus();
                }
            } else {
                this.model = new Task({
                    id: this.options.el.split('-').pop(),
                    title: $(this.options.el).find('.mt-task-title').html(),
                    text: $(this.options.el).find('.mt-task-text').html()
                });
            }
        },
        events: {
            "click div": "click",
            "keyup": "onChange"
        },
        click: function(event) {
            if (!this.editMode) {
                this.eventBus.trigger("blur", this);
                this.switchEditable();
                return false;
            }
        },
        onChange: function(event) {
            this.model.set('title', $(this.el).find(this.title).html());
            this.model.set('text', $(this.el).find(this.text).html());
            if (this.model.get('id') === 'new' && !this.hasChanged) {
                if (this.model.validate()) {
                    this.model.set('id', '' + new Date().getTime());
                    this.$el.attr('id', 'task-' + this.model.get('id'));
                }
            }
            this.hasChanged = true;
        },
        render: function() {
            $(this.el).html(templates("task", {task: this.model.toJSON()}));
            return this;
        },
        switchEditable: function(on) {
            // stop running animations
            $(this.el).find(this.title).stop(true, false);
            $(this.el).find(this.text).stop(true, false);
            if (typeof on === 'undefined') {
                on = true;
            }
            if (on) {
                this.editMode = true;
                $(this.el).find(this.title).attr('contenteditable', 'true');
                $(this.el).find(this.text).attr('contenteditable', 'true');
                $(this.el).find(this.title).css('backgroundColor', '#EAFFEA');
                $(this.el).find(this.text).css('backgroundColor', '#EAFFEA');
            } else {
                this.editMode = false;
                $(this.el).find(this.title).attr('contenteditable', 'false');
                $(this.el).find(this.text).attr('contenteditable', 'false');
                $(this.el).find(this.title).animate({'backgroundColor': 'white'});
                $(this.el).find(this.text).animate({'backgroundColor': 'white'});
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
            $(this.el).find(this.title).focus();
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