/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Executor of Backbone.sync operations invoked via socket.
 * Method name = backbone.model.url
 */

var
        mongoose = require('mongoose')
        , backboneMongoose = require('../lib/mt.backbone.mongoose')
        , tasks = require('../controllers/tasks')
        , passport = require('passport')
        , log = require('../lib/mt.logger')(module)
        ;

module.exports = {
    'user/login': function(socket, data, cb) {
        log.profile('passport login');
        var req = {
            body: {
                email: data.model.email,
                password: data.model.password
            }
        };
        passport.authenticate('local', function(err, user, info) {
            log.profile('passport login');
            if (user) {
                socket.handshake.session.user = backboneMongoose.convert(user);
                socket.handshake.session.save();
                cb(null, 'OK');
            } else {
                cb('Login error!');
            }
        })(req);
    },
    'user/logout': function(socket, data, cb) {
        User = require('../models/user');
        socket.handshake.session.user = null;
        socket.handshake.session.save();
        cb(null);
    },
    'user/register': function(socket, data, cb) {
        User = require('../models/user');
        User.register(data.model, data.model['password'], function(err, user) {
            if (err || !user) {
                cb(err);
            } else {
                socket.handshake.session.user = user;
                socket.handshake.session.save();
                cb(null, 'OK');
            }
        });
    },
    'task/save': function(socket, data, cb) {
        var context = {
            data: data,
            user: socket.handshake.session.user
        };
        tasks.saveTask(context, cb);
    }
};