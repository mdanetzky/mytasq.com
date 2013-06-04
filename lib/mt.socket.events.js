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

var backboneEvents = require('../lib/mt.backbone');

module.exports = {
    'backbone.sync': function(data, callbackfn) {
        socket = this;
        console.log('backbone.sync');
        console.log(data);
        backboneEvents[data.url](socket, data, function(err) {
            console.log("callback from bbsync " + err);
            if (err) {
                callbackfn('ERROR', null);
            } else {
                callbackfn(null, 'OK');
            }
        });
    }
};