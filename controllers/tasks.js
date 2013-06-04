/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

var Task = require('../models/task')
        ;

module.exports = exports = {
    publicTasks: function(context, callback) {
        Task.find({public: true}).sort('-lastChangeTime').limit(5).lean().exec(callback);
    },
    userTasks: function(context, callback) {
        if (context.user) {
            Task.find({author: context.user._id}).sort('-lastChangeTime').limit(5).lean().exec(callback);
        } else {
            callback('user not logged in');
        }
    },
    saveTask: function(context, callback){

    }
};