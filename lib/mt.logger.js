/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * logger definitions using winston
 */

var winston = require('winston')
        , conf = require('../lib/mt.conf')
        , moment = require('moment')
        , fs = require('fs')
        , path = require('path')
        , logDir = path.join(conf.appPathAbsolute, 'log')
        , level = conf.loglevel
        ;

if (!fs.existsSync(logDir)) {
    fs.mkdir(logDir, function(error) {
        console.log(error);
    });
}

var log = new (winston.Logger)({
    transports: [
        new winston.transports.File({
            level: level,
            filename: path.join(logDir, 'mytasq.log'),
            maxsize: 10000000,
            maxFiles: 10,
            json: false,
            prettyPrint: true,
            stringify: true,
            handleExceptions: true,
//            timestamp: false,
            timestamp: function() {
                return moment().format("YYYY-MM-DD HH:mm:ss");
            }
        })
//        ,
//        new winston.transports.Console({
//            level: level,
//            handleExceptions: true,
//            json: false,
//            stringify:true,
//            prettyPrint: true
//        })
    ]
});

var logFn = function(level, prefix, msg, vars) {
//    return;
    if (typeof msg === 'string' && typeof vars !== 'undefined') {
        log.log(level, prefix + ': ' + msg, vars);
    }
    else if (typeof msg === 'string' && typeof vars === 'undefined') {
        log.log(level, prefix + ': ' + msg);
    }
    else if (typeof msg !== 'undefined' && typeof vars === 'undefined') {
        log.log(level, prefix + ': ', msg);
    }
};

var logger = function(module) {
    var prefix = '';
    if (module) {
        prefix += module.filename.split(path.sep).pop();
    }
    return {
        debug: function(msg, vars) {
            logFn('debug', prefix, msg, vars);
        },
        info: function(msg, vars) {
            logFn('info', prefix, msg, vars);
        },
        warn: function(msg, vars) {
            logFn('warn', prefix, msg, vars);
        },
        error: function(msg, vars) {
            logFn('error', prefix, msg, vars);
        },
        log: function(level, msg, vars) {
            logFn(level, prefix, msg, vars);
        }
    };
};
module.exports = exports = logger;
