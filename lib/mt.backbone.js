/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

module.exports = {
    'user/login': function(socket, data, cb) {
        User = require('../models/user');
        User.authenticate()(data.model.email, data.model.password, function(err, user) {
            if (err || !user) {
                cb("Error: " + err);
            } else {
                socket.handshake.session.user = user;
                socket.handshake.session.save();
                cb(null);
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
                cb(null);
            }
        });
    }
};