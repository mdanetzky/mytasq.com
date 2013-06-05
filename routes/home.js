/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * home page route
 */

var tasksController = require('../controllers/tasks')
        , async = require('async')
        , backboneMongoose = require('../lib/mt.backbone.mongoose')
        ;

exports = module.exports = function(req, res) {
    var renderingContext = {};
    renderingContext.session = req.session || {};
    renderingContext.user = req.session.user || false;
    renderingContext.templates = require('../lib/mt.templates');
    req.session.visitCount = req.session.visitCount ? req.session.visitCount + 1 : 1;
    async.parallel([
        function(callback) {
            tasksController.publicTasks(null,function(err, tasks){
                if(err){
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
    ], function(err) { //This is the final callback
        res.render('index.html', renderingContext);
    });
};