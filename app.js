/**
 * MyTasq.com
 * Application definition
 * 
 * Author: Matthias Danetzky
 */

var express = require('express')
        , routes = require('./routes')
        , http = require('http')
        , path = require('path')
        , mongoose = require('mongoose')
        , engines = require('consolidate')
        , util = require('util')
        , conf = require('./lib/mt.conf')
        ;

// Check for errors in configuration
if (conf.err) {
    console.log(conf.err);
    process.exit(1);
}

// set absolute path to static resources
if (!conf.staticPathAbsolute) {
    if (!conf.staticPathRelative) {
        console.log("Missing staticPath in configuration! Exiting");
        process.exit(1);
    }
    conf.staticPathAbsolute = path.join(__dirname, conf.staticPathRelative);
}

// Connect to the database
mongoose.connect(conf.db.uri, conf.db.options, function(err) {
    if (err) {
        console.log(conf.err);
        process.exit(1);
    }
});

// Create session store
var MongoStore = require('connect-mongo')(express);
var sessionStore = new MongoStore(conf.session.db);

// Create express app
var app = express();

app.configure(function() {
    app.engine('.jade', engines.jade);
    app.engine('.html', engines.underscore);

    app.set('port', process.env.PORT || 80);
    app.set('views', __dirname + '/views');
    app.use(express.static(conf.staticPathAbsolute));
//    app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico'), {maxAge: 1}));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: conf.session.secret,
        key: conf.session.key,
        'cookie': {expires: false, maxAge: 365 * 24 * 60 * 60 * 1000}, // one year
        store: sessionStore
    }));
    app.use(app.router);

    app.use(express.logger('dev'));
    require('./lib/mt.passport')(app);
});
app.configure('development', function() {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});
app.configure('production', function() {
    app.use(express.errorHandler());
});

// Routes
app.get('/', routes.home);
app.get('/testdata', routes.testdata);
app.get('/content', routes.content);
app.post('/dummy', function(req, res) {
    res.send('');
});
app.get('/dummy', function(req, res) {
    res.send('');
});

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

// socket event handlers
// current socket is passed as 'this'
var socketEvents = require('./lib/mt.socket.events');

var io = require('./lib/mt.socket')(server, sessionStore, socketEvents);

require('./lib/test');