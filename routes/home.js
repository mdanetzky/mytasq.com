/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * home page route
 */

exports = module.exports = function(req, res) {
    var renderingContext = {};
    renderingContext.session = req.session || {};
    renderingContext.user = req.session.user || false;
    renderingContext.templates = require('../lib/mt.templates');
    if (renderingContext.user) {
        renderingContext.task = {
            id: "12345322",
            name: "The Task",
            description: "sfaf asdf asf a fa sf as fd as fa sdfa sfasdfasd fa sf asd fas f asdf"
        };
    } else {
        renderingContext.task = undefined;
    }
    req.session.visitCount = req.session.visitCount ? req.session.visitCount + 1 : 1;
    res.render('index.html', renderingContext);
};