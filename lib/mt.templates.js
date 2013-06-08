/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * underscore template execution and caching function
 */

var tmplCache = {}
, fs = require('fs')
        , _ = require('underscore')
        , express = require('express')
        , conf = require('../lib/mt.conf')
        , path = require('path')
        , log = require('../lib/mt.logger')
        , templatesPath = path.join(conf.staticPathAbsolute, 'js', 'templates')
        , viewsPath = path.join(conf.staticPathAbsolute, '..', 'views')
        ;

// precompile and cache all templates in given folder
var cacheFolder = function(tmplFolderPath) {
    log.info('Precompiling templates in ' + tmplFolderPath);
    fs.readdir(tmplFolderPath, function(err, files) {
        files.forEach(function(filename) {
            var lastDot = filename.lastIndexOf('.');
            if (lastDot) {
                var ext = (lastDot < 0) ? '' : filename.substr(lastDot);
                if (ext === '.html') {
                    var templateName = filename.substring(0, lastDot);
                    log.info("Compiling template: " + filename);
                    cacheTemplate(tmplFolderPath, templateName);
                }
            }
        });
    });
};

var cacheTemplate = function(tmplFolderPath, templateName) {
    var tmplPath = path.join(tmplFolderPath, templateName + ".html");
    data = fs.readFileSync(tmplPath, 'utf8');
    if (data) {
        tmplCache[templateName] = _.template(data);
        log.info("Template '" + templateName + "' compiled and cached");
    } else {
        log.error("Error reading file: " + tmplPath);
        log.error(err);
    }
};

cacheFolder(templatesPath);
cacheFolder(viewsPath);


module.exports = exports = function(tmplName, context) {
    if (!tmplCache[tmplName]) {
        log.debug(tmplCache);
        log.error("Missing template: " + tmplName);
        return "Missing template: " + tmplName;
    } else {
        context = _.extend(_.clone(this), context);
        return tmplCache[tmplName](context);
    }
};
