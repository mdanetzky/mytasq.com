/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

define(['backbone', 'underscore', 'mt.socket', 'jquery'], function(Backbone, _, socket, $) {
    var originalCollection, originalModel, originalView, originalSync;

    originalSync = Backbone.sync;
    originalModel = Backbone.Model.prototype.constructor;
    originalView = Backbone.View.prototype.constructor;
    originalCollection = Backbone.Collection.prototype.constructor;

    // collection with models to be saved with delay
    var deferredModels = new Backbone.Collection();
    // on window close try to save all deferred models immediately
    $(window).bind('unload beforeunload', function(e) {
        var isRunning;
        if (!isRunning) {
            isRunning = true;
            deferredModels.each(function(model) {
                sendData(model._saveMethodDeferred, model, {
                    success: function() {
                    },
                    error: function() {
                        // todo store unsaved data in browser
                    }
                });
            });
        }
    });

    var bufferModelChanges = function(buffer, model) {
        var changedAttributes = model.changedAttributes();
        if (changedAttributes) {
            if (buffer) {
                buffer = _.extend(buffer, model.changedAttributes());
            } else {
                buffer = model.changedAttributes();
            }
        }
        return buffer;
    };

    var sendData = function(method, model, options) {
        var error, socket, success, _ref;
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

        // check if anything to send
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
    };

    Backbone.sync = function(method, model, options) {
        if (options.deferredSave) {
            // Postpone save by deferralTime
            var deferralTime = 1000;
            model._saveBuffer = bufferModelChanges(model._saveBuffer, model);
            if (model._saveBuffer) {
                delete options.deferredSave;
                if (model._saveTimeoutDeferred) {
                    // Cancel any other deferrals on this model
                    clearTimeout(model._saveTimeoutDeferred);
                }
                model._saveMethodDeferred = method;
                deferredModels.add(model);
                model._saveTimeoutDeferred = setTimeout(function() {
                    deferredModels.remove(model);
                    Backbone.sync(method, model, options);
                }, deferralTime);
            }
            return;
        }
        if (model._savingData && !options.immediate) {
            // Buffer changes until current save is finished
            model._saveBuffer = bufferModelChanges(model._saveBuffer, model);
            // If there is any data not yet saved,
            // try to save it later
            if (model._saveBuffer) {
                if (model._saveTimeoutQueue) {
                    clearTimeout(model._saveTimeoutQueue);
                }
                model._saveTimeoutQueue = setTimeout(function() {
                    model._saveTimeoutQueue = null;
                    Backbone.sync(method, model, options);
                }, 200);
            }
        } else {
            sendData(method, model, options);
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