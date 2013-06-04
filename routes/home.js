/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * home page route
 */

var tasksController = require('../controllers/tasks')
        , async = require('async');

exports = module.exports = function(req, res) {
    var renderingContext = {};
    renderingContext.session = req.session || {};
    renderingContext.user = req.session.user || false;
    renderingContext.templates = require('../lib/mt.templates');
    req.session.visitCount = req.session.visitCount ? req.session.visitCount + 1 : 1;
    if (renderingContext.user) {
        renderingContext.task = {
            id: "12345322",
            name: "The Task",
            description: "sfaf asdf asf a fa sf as fd as fa sdfa sfasdfasd fa sf asd fas f asdf"
        };
    } else {
        renderingContext.task = undefined;
    }
    async.parallel([
        function(callback) {
            tasksController.publicTasks(null,function(err, tasks){
                if(err){
                    console.log(err);
                    renderingContext.tasks = undefined;
                } else {
                    renderingContext.tasks = tasks;
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