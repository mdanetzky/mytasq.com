/**
 * MyTasq.com
 * Application definition
 * 
 * Author: Matthias Danetzky
 */

// Log uncaught exceptions to console
process.on('uncaughtException', function (error) {
   console.log(error.stack);
});

var express = require('express'),
        cluster = require('cluster'),
        routes = require('./routes'),
        http = require('http'),
        path = require('path'),
        mongoose = require('mongoose'),
        engines = require('consolidate'),
        util = require('util'),
        conf = require('./lib/mt.conf'),
        cookieParser = require('cookie-parser'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        compress = require('compression'),
        errorHandler = require('errorhandler'),
        logger = require('morgan'),
        session = require('express-session'),
        log = require('./lib/mt.logger')(module);
log.info('#################################');
log.info('START: mytasq.com server instance');
// Precompile templates at start.
require('./lib/mt.templates');
// Check for errors in configuration.
if (conf.err) {
    log.error(conf.err);
    process.exit(1);
}
if (conf.development) {
    mongoose.set('debug', function(collectionName, method, query, doc) {
        log.log('debug', 'Mongoose collection: "' + collectionName + '" method: "' + method + '" query: ', query);
    });
}
// Prepare logStream for express.
var logStream = {
    write: function(message) {
        log.info(message);
    }
};
// Connect to the database.
mongoose.connect(conf.db.uri, conf.db.options, function(err) {
    if (err) {
        console.log(conf.err);
        process.exit(1);
    }
});
// Create session store.
var MongoStore = require('connect-mongo')(session);
var sessionStore = new MongoStore(conf.session.db);
// Define CPUs cluster.
if (cluster.isMaster && !conf.singleThread) {
    // Count the machine's CPUs.
    var cpuCount = require('os').cpus().length;
    log.info('Starting cluster for ' + cpuCount + ' CPUs');
    // Create a worker for each CPU.
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
} else {
    // Start Express app in worker process.
    var app = express();
//    app.configure(function () {
    app.engine('.jade', engines.jade);
    app.engine('.html', engines.underscore);
    app.set('port', process.env.PORT || 80);
    app.set('views', __dirname + '/views');
    app.use(compress());
    app.use(express.static(conf.staticPathAbsolute));
    //      app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico'), {maxAge: 1}));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(session({
        secret: conf.session.secret,
        key: conf.session.key,
        'cookie': {
            expires: false,
            maxAge: 365 * 24 * 60 * 60 * 1000 // one year
        },
        store: sessionStore,
        resave: true,
        saveUninitialized: true    
    }));
    //app.use(app.router);
    app.use(logger("combined", {
        stream: logStream
    }));
    require('./lib/mt.passport')(app);
    if (conf.development) {
        app.use(errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    } else {
        app.use(errorHandler());
    }
    
    // Routes.
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
    // Socket event handlers.
    var socketEvents = require('./lib/mt.socket.events');
    var io = require('./lib/mt.socket')(server, sessionStore, socketEvents);
}