/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * socket.io configuration
 */

var conf = require('../lib/mt.conf')
//        , connect = require('connect')
//        , cookie = require('express/node_modules/cookie')
        , cookieParser = require('cookie-parser')
        , cookie = require('cookie')
//        , RedisStore = require('socket.io/lib/stores/redis')
        , redisAdapter = require('socket.io-redis')
        , conf = require('../lib/mt.conf')
        , redis = require('redis')
        , pub = redis.createClient()
        , sub = redis.createClient()
        , client = redis.createClient()
        , log = require('../lib/mt.logger')(module)
        , socketIo = require('socket.io');

module.exports = function(server, sessionStore, socketEvents) {

    var io = socketIo(server);
    io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));
//    io.set('logger', {
//        debug: function() {
//        },
////            debug: log.debug,
//        info: log.info,
//        error: log.error,
//        warn: log.warn
//    });
//    io.set('store', new RedisStore({
//        redisPub: pub,
//        redisSub: sub,
//        redisClient: client
//    }));
    var connectedSocketHandler = function(socket) {
        for (var event in socketEvents) {
            if (socketEvents.hasOwnProperty(event)) {
                socket.on(event, function(data, callback) {
                    socketEvents[event].call(socket, data, callback);
                });
            }
        }
    };

//    if (conf.development) {
//        io.enable('browser client gzip');          // gzip the file
//        io.set('log level', 0);                    // logging level: dev
//    } else {
//        io.enable('browser client minification');  // send minified client
//        io.enable('browser client etag');          // apply etag caching logic based on version number
//        io.enable('browser client gzip');          // gzip the file
//        io.set('log level', 0);                    // reduce logging
//    }


    // Authorization
    io.use(function(socket, next) {
        var handshakeData = socket.request;
        log.debug('socket auth');
        if (handshakeData.headers.cookie) {
            log.debug('socket auth: got handshakeData.headers.cookie');
            log.debug('socket auth: ' + cookie.parse(handshakeData.headers.cookie));
            handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
            handshakeData.sessionID = cookieParser.signedCookie(
                    handshakeData.cookie[conf.session.key], conf.session.secret);
            sessionStore.load(handshakeData.sessionID, function(err, session) {
                if (err) {
                    next(new Error('Error in session store: ' + err));
                } else if (!session) {
                    next(new Error('Session not found.'));
                }
                // Session found
                socket.request.session = session;
                next();
            });
        } else {
            log.debug('socket auth: No cookie transmitted.');
            next(new Error('No cookie transmitted.'));
        }
    });

    io.use(function(socket, next) {
        if (!socket.request.session) {
            // Big error. Probably authorization corrupted.
            log.error('SOCKET SESSION MISSING!!!');
            next(new Error('SOCKET SESSION MISSING!!!'));
        }
        if (socket.request.session.id) {
            log.debug("socket connection: Session found.");
            connectedSocketHandler(socket);
        } else {
            // Load session instance if called on another CPU in cluser.
            log.debug('Socket.io: Reloading Session instance. SID: ' + socket.request.sessionID);
            sessionStore.load(socket.request.sessionID, function(err, session) {
                if (err) {
                    log.error('Error in session store:');
                    log.error(err);
                    return;
                } else if (!session) {
                    log.error('Session not found.');
                    return;
                }
                // Session found
                socket.request.session = session;
                connectedSocketHandler(socket);
            });
        }
        next();
    });

    return io;
};