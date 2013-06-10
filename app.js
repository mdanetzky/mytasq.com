/**
 * MyTasq.com
 * Application definition
 * 
 * Author: Matthias Danetzky
 */

var express = require('express')
        , cluster = require('cluster')
        , routes = require('./routes')
        , http = require('http')
        , path = require('path')
        , mongoose = require('mongoose')
        , engines = require('consolidate')
        , util = require('util')
        , conf = require('./lib/mt.conf')
        , log = require('./lib/mt.logger')
        ;

log.info('#################################');
log.info('START: mytasq.com server instance');

// precompile templates at start
require('./lib/mt.templates');

// Check for errors in configuration
if (conf.err) {
    log.error(conf.err);
    process.exit(1);
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

// Define CPUs cluster
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    log.info('Starting cluster for ' + cpuCount + ' CPUs');
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

// Code to run if we're in a worker process
} else {

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
        log.info("Express server listening on port " + app.get('port'));
    });

// socket event handlers
// current socket is passed as 'this'
    var socketEvents = require('./lib/mt.socket.events');

    var io = require('./lib/mt.socket')(server, sessionStore, socketEvents);
}
require('./lib/test');