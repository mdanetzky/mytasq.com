/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Executor of Backbone.sync operations invoked via socket.
 * Method name = backbone.model.url
 */

var mongoose = require('mongoose')
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
                socket.request.session.user = backboneMongoose.convert(user);
                // Remove unnecessary data from session.user object.
                delete socket.request.session.user.salt;
                delete socket.request.session.user.hash;
                socket.request.session.save();
                cb(null, 'OK');
            } else {
                cb('Login error!');
            }
        })(req);
    },
    'user/logout': function(socket, data, cb) {
        User = require('../models/user');
        socket.request.session.user = null;
        socket.request.session.save();
        cb(null);
    },
    'user/register': function(socket, data, cb) {
        User = require('../models/user');
        User.register(data.model, data.model['password'], function(err, user) {
            if (err || !user) {
                cb(err);
            } else {
                socket.request.session.user = user;
                socket.request.session.save();
                cb(null, 'OK');
            }
        });
    },
    'task/save': function(socket, data, cb) {
        var context = {
            data: data,
            user: socket.request.session.user
        };
        tasks.saveTask(context, cb);
    },
    'task/tasks': function(socket, data, cb) {
        var context = {
            data: data,
            user: socket.request.session.user
        };
        tasks.getTasks(context, cb);
    }
};