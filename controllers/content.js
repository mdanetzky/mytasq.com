/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Content controller.
 */

var async = require('async')
        , backboneMongoose = require('../lib/mt.backbone.mongoose')
        , tasksController = require('../controllers/tasks')
        , log = require('../lib/mt.logger')(module)
        ;

module.exports = exports = {
    mainContent: function(context, callback) {
        var renderingContext = {}, getTasks;
        renderingContext.session = context.session || {};
        renderingContext.user = context.session.user || false;
        renderingContext.templates = require('../lib/mt.templates');
        context.session.visitCount = context.session.visitCount ? context.session.visitCount + 1 : 1;
        context.session.lastVisit = Date.now();
        renderingContext.teams = [];
        if (context.session.user) {
            getTasks = tasksController.getTasks;
            renderingContext.data = {
                query: {
                    name: 'tasks-created-by-me'
                }
            };
            renderingContext.taskListId = renderingContext.data.query.name;
        } else {
            getTasks = tasksController.getTasks;
            renderingContext.data = {
                query: {
                    name: 'tasks-public'
                }
            };
            renderingContext.taskListId = renderingContext.data.query.name;
        }
        async.parallel([
            function(callback) {
                getTasks(renderingContext, function(err, tasks) {
                    if (err) {
                        log.error(err);
                        renderingContext.tasks = undefined;
                    } else {
                        renderingContext.tasks = tasks;
                    }
                    callback();
                });
            }
        ], function(err) {
            // This is the final callback.
            callback(err, renderingContext);
        });
    }
};

