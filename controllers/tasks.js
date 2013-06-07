/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

var Task = require('../models/task')
        , mongoose = require('mongoose')
        , backboneMongoose = require('../lib/mt.backbone.mongoose')
        ;

module.exports = exports = {
    publicTasks: function(context, callback) {
        Task.find({public: true}).sort('-lastModifiedTime').limit(5).lean().exec(callback);
    },
    userTasks: function(context, callback) {
        if (context.user) {
            Task.find({author: context.user._id}).sort('-lastModifiedTime').limit(5).lean().exec(callback);
        } else {
            callback('user not logged in');
        }
    },
    saveTask: function(context, callback) {
        var id = context.data.model.id;
        var mongoData = backboneMongoose.convert(context.data.model);
        mongoData.lastModifiedTime = new Date();
        if (id === 'new') {
            delete mongoData._id;
            if (context.user) {
                mongoData.author = new mongoose.Types.ObjectId(context.user._id);
            }
            Task.create(mongoData, function(err, task) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, task.get('_id').toString());
                }
            });
        } else {
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