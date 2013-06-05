/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

var
        mongoose = require('mongoose')
        , backboneMongoose = require('../lib/mt.backbone.mongoose')
        , Task = require('../models/task')
        ;

module.exports = {
    'user/login': function(socket, data, cb) {
        User = require('../models/user');
        User.authenticate()(data.model.email, data.model.password, function(err, user) {
            if (err || !user) {
                cb("Error: " + err);
            } else {
                socket.handshake.session.user = user;
                socket.handshake.session.save();
                cb(null, 'OK');
            }
        });
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
                cb(null, 'OK');
            }
        });
    },
    'task': function(socket, data, cb) {
        var mongoData = backboneMongoose.convert(data.model);
        if (data.model.id === 'new') {
            delete mongoData._id;
            Task.create(mongoData, function(err, task) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, task.get('_id').toString());
                }
            });
        } else {
            var id = mongoData._id;
            delete mongoData._id;
            Task.update({_id: id}, mongoData, {upsert: true}, function(err) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, 'OK');
                }
            });
        }
    }
};