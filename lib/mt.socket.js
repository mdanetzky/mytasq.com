/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * socket.io configuration
 */

var conf = require('../lib/mt.conf')
        , connect = require('express/node_modules/connect')
        , cookie = require('express/node_modules/connect/node_modules/cookie')
        , RedisStore = require('socket.io/lib/stores/redis')
        , conf = require('../lib/mt.conf')
        , redis = require('socket.io/node_modules/redis')
        , pub = redis.createClient()
        , sub = redis.createClient()
        , client = redis.createClient()
        , log = require('../lib/mt.logger')(module)
        , socketIo = require('socket.io');

module.exports = function(server, sessionStore, socketEvents) {

    var io = socketIo.listen(server);
    io.configure(function() {
        io.set('logger', {
            debug: function() {
            },
//            debug: log.debug,
            info: log.info,
            error: log.error,
            warn: log.warn
        });
        io.set('store', new RedisStore({
            redisPub: pub,
            redisSub: sub,
            redisClient: client
        }));

        if (conf.development) {
            io.enable('browser client gzip');          // gzip the file
            io.set('log level', 0);                    // logging level: dev
        } else {
            io.enable('browser client minification');  // send minified client
            io.enable('browser client etag');          // apply etag caching logic based on version number
            io.enable('browser client gzip');          // gzip the file
            io.set('log level', 0);                    // reduce logging
        }

        io.set('authorization', function(handshakeData, accept) {
            log.debug('socket auth');
            if (handshakeData.headers.cookie) {
                log.debug('socket auth: got handshakeData.headers.cookie');
                log.debug('socket auth: ' + cookie.parse(handshakeData.headers.cookie));
                handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
                handshakeData.sessionID = connect.utils.parseSignedCookie(
                        handshakeData.cookie[conf.session.key], conf.session.secret);
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
                log.debug('socket auth: No cookie transmitted.');
                return accept('No cookie transmitted.', false);
            }
        });
    });

    io.sockets.on('connection', function(socket) {
        if (!socket.handshake.session) {
            // Big error. Probably io.set('authorization') corrupted.
            log.error('SOCKET SESSION MISSING!!!');
            return;
        }
        if (socket.handshake.session.id) {
            log.debug("socket connection: Session found.");
            connectedSocketHandler(socket);
        } else {
            // Load session instance if called on another CPU in cluser.
            log.debug('Socket.io: Reloading Session instance. SID: ' + socket.handshake.sessionID);
            sessionStore.load(socket.handshake.sessionID, function(err, session) {
                if (err) {
                    log.error('Error in session store:');
                    log.error(err);
                    return;
                } else if (!session) {
                    log.error('Session not found.');
                    return;
                }
                // Session found
                socket.handshake.session = session;
                connectedSocketHandler(socket);
            });
        }
    });

    var connectedSocketHandler = function(socket) {
        for (var event in socketEvents) {
            if (socketEvents.hasOwnProperty(event)) {
                socket.on(event, function(data, callback) {
                    socketEvents[event].call(socket, data, callback);
                });
            }
        }
    };
    return io;
};