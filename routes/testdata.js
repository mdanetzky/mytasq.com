/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

var Task = require('../models/task')
        ;

exports = module.exports = function(req, res) {
    for (var i = 1; i < 10; i++) {
        task = new Task({
            title: "Test task " + i,
            text: "this is a test task\nnumber: " + i,
            public: true
        });
        task.save(function(err) {
            if (err) {
                console.log("error: " + err);
            }
        });
    }
    res.redirect('/');
};
