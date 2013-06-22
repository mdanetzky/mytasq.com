/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Socket.io main init code.
 */

define(['socket.io', 'uri.parser'], function(io, uriParser) {
    var uri = uriParser(document.location.href);
    var socketUri = uri.protocol + '://' + uri.authority;
    var socket = io.connect(socketUri);
    socket.on('connect', function() {
        console.log('sio connected');
    });
    socket.on('disconnect', function() {
        console.log('sio disconnected');
    });
    socket.on('error', function() {
        // TODO: clientside error handling.
        console.log('sio error');
    });
    return socket;
});