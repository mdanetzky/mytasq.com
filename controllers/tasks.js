/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Tasks controller.
 */

var Task = require('../models/task')
        , mongoose = require('mongoose')
        , sanitize = require('validator').sanitize
        , backboneMongoose = require('../lib/mt.backbone.mongoose')
        , log = require('../lib/mt.logger')(module)
        ;
module.exports = exports = {
    publicTasks: function(context, callback) {
        Task.find({public: true}).sort('-lastModifiedTime').limit(5).lean().exec(callback);
    },
    userTasks: function(context, callback) {
        if (context.user) {
            Task.find({author: context.user.id, done: false}).sort('-lastModifiedTime').limit(15).lean().exec(callback);
        } else {
            callback('user not logged in');
        }
    },
    saveTask: function(context, callback) {
        var id = context.data.model.id;
        var mongoData = backboneMongoose.convert(context.data.model);
        if (context.data.model.title) {
            log.debug('Original title: ' + context.data.model.title);
            context.data.model.title = sanitize(context.data.model.title).xss().trim();
            log.debug('Sanitized title: ' + context.data.model.title);
        }
        if (context.data.model.text) {
            log.debug('Original text: ' + context.data.model.text);
            context.data.model.text = sanitize(context.data.model.text).xss().trim();
            log.debug('Sanitized text: ' + context.data.model.text);
        }
        mongoData.lastModifiedTime = new Date();
        if (id === 'new') {
            delete mongoData._id;
            if (context.user) {
                // Create new task for existing user only.
                mongoData.author = new mongoose.Types.ObjectId(context.user.id);
                Task.create(mongoData, function(err, task) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, task.get('_id').toString());
                    }
                });
            }
        } else {
            // Modify existing task.
            id = mongoData._id;
            delete mongoData._id;
            Task.update({_id: id}, mongoData, {upsert: true}, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, 'OK');
                }
            });
        }
    }
};