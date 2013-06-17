/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone extension.
 * Socket.io based sync with buffering and deferred send.
 */

define(['backbone', 'underscore', 'mt.socket', 'jquery'], function(Backbone, _, socket, $) {
    var originalCollection, originalModel, originalView, originalSync;
    originalSync = Backbone.sync;
    originalModel = Backbone.Model.prototype.constructor;
    originalView = Backbone.View.prototype.constructor;
    originalCollection = Backbone.Collection.prototype.constructor;
    // Collection with models to be saved with delay.
    var deferredModels = new Backbone.Collection();
    // On window close try to save all deferred models immediately.
    $(window).bind('unload beforeunload', function(e) {
        var isRunning;
        if (!isRunning) {
            isRunning = true;
            deferredModels.each(function(model) {
                sendData(model._saveMethodDeferred, model, {
                    success: function() {
                    },
                    error: function() {
                        // TODO store unsaved data in browser
                    }
                });
            });
        }
    });
    var bufferModelChanges = function(buffer, model, options) {
        var changedAttributes;
        if (options.patch) {
            changedAttributes = model.changedAttributes();
        } else {
            changedAttributes = model.toJSON();
        }
        if (changedAttributes) {
            if (buffer) {
                buffer = _.extend(buffer, model.changedAttributes());
            } else {
                buffer = model.changedAttributes();
            }
        }
        return buffer;
    };
    var sendData = function(method, data, options) {
        var error, socket, modelAttributes, socketData, model2send = {};
        socket = data.socket;
        if (!socket) {
            return originalSync.apply(this, arguments);
        }
        if (data instanceof Backbone.Model) {
            if (options.patch) {
                modelAttributes = data.changedAttributes();
            } else {
                modelAttributes = data.toJSON();
            }
        }
        if (data instanceof Backbone.Collection && !options.query) {
            
            // TODO: save collection.
            
        }
        // Check if there is anything to be sent.
        if (modelAttributes || data._saveBuffer || options.query) {
            // If not sent within 5 sec., mark timeout.
            data._saveTimeout = setTimeout(function() {

                // TODO: store data until the connection is back on

                console.log('SOCKET SEND TIMEOUT');
                data._saveTimeout = null;
                error.call(this, 'timeout');
            }, 5000);
            if (data._saveBuffer) {
                model2send = data._saveBuffer;
                delete data._saveBuffer;
            }
            if (modelAttributes) {
                model2send = _.extend(model2send, modelAttributes);
            }
            model2send.id = data.id;
            data._savingData = model2send;
            var dataUrl = (typeof data.url === 'function') ? data.url() : data.url;
            socketData = {
                url: dataUrl,
                method: method
            };
            if(data instanceof Backbone.Model){
                socketData.model = model2send;
            }
            if(options.query) {
                socketData.query = options.query;
            }
            socket.emit("backbone.sync", socketData, function(err, response) {
                if (err) {
                    options.error.call(this, err);
                } else {
                    options.success.call(this, response);
                }
                delete data._savingData;
                clearTimeout(data._saveTimeout);
                data._saveTimeout = null;
            });
        }
    };
    Backbone.sync = function(method, data, options) {
        if (options.deferredSave) {
            // Postpone save by deferralTime.
            var deferralTime = 1000;
            data._saveBuffer = bufferModelChanges(data._saveBuffer, data, options);
            if (data._saveBuffer) {
                delete options.deferredSave;
                if (data._saveTimeoutDeferred) {
                    // Cancel any other deferrals on this model.
                    clearTimeout(data._saveTimeoutDeferred);
                }
                data._saveMethodDeferred = method;
                deferredModels.add(data);
                data._saveTimeoutDeferred = setTimeout(function() {
                    deferredModels.remove(data);
                    Backbone.sync(method, data, options);
                }, deferralTime);
            }
            return;
        }
        if (data._savingData && !options.immediate) {
            // Buffer changes until current save is finished.
            data._saveBuffer = bufferModelChanges(data._saveBuffer, data, options);
            // If there is any data not yet saved,
            // try to save it later.
            if (data._saveBuffer) {
                if (data._saveTimeoutQueue) {
                    clearTimeout(data._saveTimeoutQueue);
                }
                data._saveTimeoutQueue = setTimeout(function() {
                    data._saveTimeoutQueue = null;
                    Backbone.sync(method, data, options);
                }, 200);
            }
        } else {
            sendData(method, data, options);
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