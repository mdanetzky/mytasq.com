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

var logger = new (winston.Logger)({
    transports: [
        new winston.transports.File({
            level: level,
            filename: path.join(logDir, 'mytasq.log'),
            maxsize: 10000000,
            maxFiles: 10,
            json:false,
            prettyPrint:true,
            stringify:true,
            handleExceptions: true,
            timestamp: function(){
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

module.exports = exports = logger;
