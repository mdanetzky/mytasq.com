/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Socket.io events
 * 
 * Event's definition
 * 'name': function
 * is passed into:
 * socket.on('name', function)
 * 
 * function's 'this' is set to current socket
 */

var backboneEvents = require('../lib/mt.backbone')
        , log = require('../lib/mt.logger')
        ;

module.exports = {
    'backbone.sync': function(data, callbackfn) {
        socket = this;
        log.debug('backbone.sync ' + data.url);
        log.debug(data);
        backboneEvents[data.url](socket, data, function(err, response) {
            log.debug("callback from backbone event " + data.url);
            if (err) {
            log.debug("error: " + err);
                callbackfn(err, null);
            } else {
                callbackfn(null, response);
            }
        });
    }
};