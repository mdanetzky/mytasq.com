/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * User controller.
 */

var User = require('../models/user'),
    Task = require('../models/task'),
    mongoose = require('mongoose'),
    sanitize = require('validator').sanitize,
    backboneMongoose = require('../lib/mt.backbone.mongoose'),
    log = require('../lib/mt.logger')(module),
    pageSize = 15;
    
module.exports = exports = {
    "login": function (context, callback) {
        callback(null, context);
    },
    getMainTasks: function (context, callback) {
        context = context || {};
        callback = callback || function(){};
        context.user = context.user || (context.session ? context.session.user : false);
        if (context.user) {
            Task.find({
                author: context.user.id,
                done: false
            }).or([{
                deleted: null
            }, {
                deleted: false
            }]).sort('-lastModifiedTime').skip(skip).limit(pageSize).lean().exec(function (err, data) {
                if (!err) {
                    callback(err, backboneMongoose.convert(data));
                } else {
                    callback(err, data);
                }
            });
        } else {
            context.mainTasks = [];
            callback("Missing user", context);
        }
    },
    addMainTask: function (context, callback) {
        context.user = context.user || (context.session ? context.session.user : false);
        if (context.user) {

        } else {
            callback("Missing user", context);
        }
    },
    deleteMainTask: function (context, callback) {
        context.user = context.user || (context.session ? context.session.user : false);
        if (context.user) {

        } else {
            callback("Missing user", context);
        }
    }
};