exports = module.exports = function(req, res) {
    var renderingContext = {};
    renderingContext.title = 'MyTasq.com';
    renderingContext.user = {};
    renderingContext.user.name = 'LOGIN';
    renderingContext.session = req.session;

    req.session.visitCount = req.session.visitCount ? req.session.visitCount + 1 : 1;
    res.render('index.html', renderingContext);
};