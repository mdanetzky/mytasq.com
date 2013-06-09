/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['backbone', 'underscore', 'mt.socket'], function(Backbone, _, socket) {
    var originalCollection, originalModel, originalView, originalSync;

    originalSync = Backbone.sync;
    originalModel = Backbone.Model.prototype.constructor;
    originalView = Backbone.View.prototype.constructor;
    originalCollection = Backbone.Collection.prototype.constructor;

    Backbone.sync = function(method, model, options) {
        var error, socket, success, _ref;
        if (model._savingData) {
            // Buffer changes until current save is finished
            var changedAttributes = model.changedAttributes();
            if (changedAttributes) {
                if (model._saveBuffer) {
                    model._saveBuffer = _.extend(model._saveBuffer, model.changedAttributes());
                } else {
                    model._saveBuffer = model.changedAttributes();
                }
            }
            // If there is any data not yet saved,
            // try to save it later
            if (model._saveBuffer) {
                if (model._saveQueueTimeout) {
                    clearTimeout(model._saveQueueTimeout);
                }
                model._saveQueueTimeout = setTimeout(function() {
                    model._saveQueueTimeout = null;
                    Backbone.sync(method, model, options);
                }, 200);
            }
        } else {
            socket = model.socket || ((_ref = model.collection) !== null ? _ref.socket : void 0);
            if (!socket) {
                return originalSync.apply(this, arguments);
            }
            success = options.success;
            delete options.success;
            error = options.error;
            delete options.error;

            var model2send = {};
            var changedAttributes = model.changedAttributes();
            if (changedAttributes || model._saveBuffer) {

                model._saveTimeout = setTimeout(function() {

                    // todo: store data to be saved when connection is up

                    console('SAVE TIMEOUT');
                    model._saveTimeout = null;
                    error.call(this, 'timeout');
                }, 5000);
                if (model._saveBuffer) {
                    model2send = model._saveBuffer;
                    delete model._saveBuffer;
                }
                if (changedAttributes) {
                    model2send = _.extend(model2send, changedAttributes);
                }

                model2send.id = model.id;
                model._savingData = model2send;
                var modelUrl = (typeof model.url === 'function') ? model.url() : model.url;
                socket.emit("backbone.sync", {
                    url: modelUrl,
                    method: method,
                    model: model2send
                }, function(err, response) {
                    if (err) {
                        error.call(this, err);
                    } else {
                        success.call(this, response);
                    }
                    delete model._savingData;
                    clearTimeout(model._saveTimeout);
                    model._saveTimeout = null;
                });
            }
        }
    };

    Backbone.Model = Backbone.Model.extend({
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