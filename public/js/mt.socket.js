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
    return socket;
});