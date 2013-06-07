/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * home page route
 */

var contentController = require('../controllers/content')
        ;

exports = module.exports = function(req, res) {
    contentController.mainContent(req, function(err, renderingContext) { 
        res.render('index.html', renderingContext);
    });
};