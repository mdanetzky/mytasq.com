/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

var conf = require('../lib/mt.conf')
        , connect = require('express/node_modules/connect')
        , cookie = require('express/node_modules/connect/node_modules/cookie')
        ;

module.exports = function(server, sessionStore, socketEvents) {

    var io = require('socket.io').listen(server);
    var RedisStore = require('socket.io/lib/stores/redis')
            , redis = require('socket.io/node_modules/redis')
            , pub = redis.createClient()
            , sub = redis.createClient()
            , client = redis.createClient();


    io.configure(function() {

        io.set('store', new RedisStore({
            redisPub: pub
                    , redisSub: sub
                    , redisClient: client
        }));
        io.enable('browser client minification');  // send minified client
        io.enable('browser client etag');          // apply etag caching logic based on version number
        io.enable('browser client gzip');          // gzip the file
        io.set('log level', 1);                    // reduce logging
        io.set('authorization', function(handshakeData, accept) {
            if (handshakeData.headers.cookie) {
                handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
                handshakeData.sessionID = connect.utils.parseSignedCookie(
                        handshakeData.cookie[conf.session.key], conf.session.secret);
                // save the session store to the data object 
                // (as required by the Session constructor)
                //handshakeData.sessionStore = sessionStore;
                sessionStore.load(handshakeData.sessionID, function(err, session) {
                    if (err) {
                        accept('Error in session store: ' + err, false);
                    } else if (!session) {
                        accept('Session not found.', false);
                    }
                    // Session found
                    handshakeData.session = session;
                    return accept(null, true);
                });
            } else {
                return accept('No cookie transmitted.', false);
            }
        });
    });

    io.sockets.on('connection', function(socket) {
        for (var event in socketEvents) {
            if (socketEvents.hasOwnProperty(event)) {
                socket.on(event, function(data, callback) {
                    socketEvents[event].call(socket, data, callback);
                });
            }
        }
    });

    return io;
};