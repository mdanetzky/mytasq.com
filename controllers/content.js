/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

var async = require('async')
        , backboneMongoose = require('../lib/mt.backbone.mongoose')
        , tasksController = require('../controllers/tasks')
        ;

module.exports = exports = {
    mainContent: function(context, callback) {
        var renderingContext = {},
                getTasks;
        renderingContext.session = context.session || {};
        renderingContext.user = context.session.user || false;
        renderingContext.templates = require('../lib/mt.templates');
        context.session.visitCount = context.session.visitCount ? context.session.visitCount + 1 : 1;
        context.session.lastVisit = Date.now();
        if (context.session.user) {
            getTasks = tasksController.userTasks;
        } else {
            getTasks = tasksController.publicTasks;
        }
        async.parallel([
            function(callback) {
                getTasks(renderingContext, function(err, tasks) {
                    if (err) {
                        console.log(err);
                        renderingContext.tasks = undefined;
                    } else {
                        renderingContext.tasks = backboneMongoose.convert(tasks);
                    }
                    callback();
                });
            },
            function(callback) {
                callback();
            }
        ], function(err) {
            //This is the final callback
            callback(err, renderingContext);
        });
    }
};

