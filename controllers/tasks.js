/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Tasks controller.
 */

var Task = require('../models/task')
        , mongoose = require('mongoose')
        , sanitize = require('sanitize-caja')
        , backboneMongoose = require('../lib/mt.backbone.mongoose')
        , log = require('../lib/mt.logger')(module)
        , pageSize = 15
        ;
module.exports = exports = {
    getTasks: function(context, callback) {
        if (context.data.query) {
            if (context.data.query.name) {
                // Execute query by name.
                var skip = (context.data.query.page || 0) * pageSize;
                switch (context.data.query.name) {
                    case 'tasks-created-by-me':
                        Task.find({
                            author: context.user.id,
                            parentTask: null,
                            done: false
                        })
                                .or([{deleted: null}, {deleted: false}])
                                .sort('-lastModifiedTime')
                                .skip(skip)
                                .limit(pageSize)
                                .lean()
                                .exec(function(err, data) {
                            if (!err) {
                                callback(err, backboneMongoose.convert(data));
                            } else {
                                callback(err, data);
                            }
                        });
                        break;
                    case 'tasks-done-by-me':
                        Task.find({author: context.user.id, done: true})
                                .or([{deleted: null}, {deleted: false}])
                                .sort('-lastModifiedTime')
                                .skip(skip)
                                .limit(pageSize)
                                .lean()
                                .exec(function(err, data) {
                            if (!err) {
                                callback(err, backboneMongoose.convert(data));
                            } else {
                                callback(err, data);
                            }
                        });
                        break;
                    case 'tasks-public':
                        Task.find({public: true})
                                .or([{done: null}, {done: false}])
                                .or([{deleted: null}, {deleted: false}])
                                .sort('-lastModifiedTime')
                                .skip(skip)
                                .limit(pageSize)
                                .lean()
                                .exec(function(err, data) {
                            if (!err) {
                                callback(err, backboneMongoose.convert(data));
                            } else {
                                callback(err, data);
                            }
                        });
                        break;
                    case 'tasks-of-task':
                        if (context.data.query.parentTaskId) {
                            Task.find({parentTask: context.data.query.parentTaskId, done: false})
                                    .or([{deleted: null}, {deleted: false}])
                                    .sort('-lastModifiedTime')
                                    .skip(skip)
                                    .limit(pageSize)
                                    .lean()
                                    .exec(function(err, data) {
                                if (!err) {
                                    callback(err, backboneMongoose.convert(data));
                                } else {
                                    callback(err, data);
                                }
                            });
                        } else {
                            log.error('getTasks (tasks-of-task): missing parentTaskId!');
                        }
                        break;
                    default:
                        callback('getTasks: No such query: ' + context.data.query.name);
                        break;
                }
            }
        } else {
            callback('getTasks: Missing query!');
        }
    },
    userTasks: function(context, callback) {
        if (context.user) {
            Task.find({author: context.user.id, done: false}).sort('-lastModifiedTime').limit(pageSize).lean().exec(callback);
        } else {
            callback('user not logged in');
        }
    },
    saveTask: function(context, callback) {

        // TODO: check if the user is authorized to perform save of particular fields

        var self = this;
        if (context.data.model.title) {
            context.data.model.title = sanitize(context.data.model.title).trim();
        }
        if (context.data.model.text) {
            context.data.model.text = sanitize(context.data.model.text).trim();
        }
        if (typeof context.data.model.deleted === 'boolean') {
            if (context.data.model.deleted) {
                // Check if task can be deleted.
                if (context.data.model.id) {
                    if (context.data.model.id === 'new') {
                        callback('Can not delete task with id="new".');
                    } else {
                        Task.findOne({_id: context.data.model.id, author: context.user.id}).lean()
                                .exec(function(err, data) {
                            if (!err) {
                                if (data) {
                                    // This task has been written by currently logged in user
                                    // and can be deleted.
                                    self.upsert(context, callback);
                                } else {
                                    callback('Unauthorized delete.');
                                }
                            } else {
                                callback(err, data);
                            }
                        });
                    }
                } else {
                    // TODO: undelete task.
                }
            } else {
                callback('Missing task id.');
            }
        } else {
            this.upsert(context, callback);
        }
    },
    upsert: function(context, callback) {
        var id = context.data.model.id;
        var mongoData = backboneMongoose.convert(context.data.model);
        if (mongoData.parentTask) {
            mongoData.parentTask = backboneMongoose.toMongooseId(mongoData.parentTask);
        }
        mongoData.lastModifiedTime = new Date();
        if (id === 'new') {
            delete mongoData._id;
            if (context.user) {
                // Create new task for existing user only.
                mongoData.author = backboneMongoose.toMongooseId(context.user.id);
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