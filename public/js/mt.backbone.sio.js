/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['backbone', 'mt.socket'], function(Backbone, socket) {
    var originalCollection, originalModel, originalView, originalSync;

    originalSync = Backbone.sync;
    originalModel = Backbone.Model.prototype.constructor;
    originalView = Backbone.View.prototype.constructor;
    originalCollection = Backbone.Collection.prototype.constructor;

    Backbone.sync = function(method, model, options) {
        var error, socket, success, _ref, timeout;

        if (!model._saving) {
            model._saving = true;
            socket = model.socket || ((_ref = model.collection) !== null ? _ref.socket : void 0);
            if (!socket) {
                return originalSync.apply(this, arguments);
            }
            success = options.success;
            delete options.success;
            error = options.error;
            delete options.error;

            var sldfkaldsfk = model.changedAttributes();
            var modelUrl = (typeof model.url === 'function') ? model.url() : model.url;
            socket.emit("backbone.sync", {
                url: modelUrl,
                method: method,
                model: model,
                options: options
            }, function(err, response) {
                if (err) {
                    error.call(this, err);
                } else {
                    success.call(this, response);
                }
                model._saving = false;
                clearTimeout(timeout);
            });
            timeout = setTimeout(function() {
                model._saving = false;
                error.call(this, 'timeout');
            }, 5000)
        }
    };

    Backbone.Model = Backbone.Model.extend({
        _saving: false,
        constructor: function(attributes, options) {
            this.socket = socket;
            originalModel.apply(this, arguments);
        }
    });

    Backbone.View = Backbone.View.extend({
        constructor: function(attributes, options) {
            this.socket = socket;
            originalView.apply(this, arguments);
        }
    });

    Backbone.Collection = Backbone.Collection.extend({
        constructor: function(attributes, options) {
            this.socket = socket;
            originalCollection.apply(this, arguments);
        }
    });

    return Backbone;
});