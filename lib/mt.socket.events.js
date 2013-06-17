/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Socket.io events
 * 
 * Event's definition form
 * 'eventName': function(data, callback)
 * 
 * is passed into:
 * socket.on('name', function)
 * 
 * function's 'this' is set to current socket
 */

var backboneEvents = require('../lib/mt.backbone')
        , log = require('../lib/mt.logger')(module)
        ;
module.exports = {
    'backbone.sync': function(data, callbackfn) {
        if (data && data.url) {
            var backboneEvent = backboneEvents[data.url];
            if (backboneEvent) {
                var socket = this;
                log.debug('backbone.sync ' + data.url);
                log.debug(data);
                backboneEvent(socket, data, function(err, response) {
                    log.debug("callback from backbone event " + data.url);
                    if (err) {
                        log.error("error: " + err);
                        callbackfn(err, null);
                    } else {
                        callbackfn(null, response);
                    }
                });
            } else {
                log.error('No such event url: ' + data.url);
            }
        }
    }
};