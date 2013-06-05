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
        , templatesPath = path.join(conf.staticPathAbsolute, 'js', 'templates')
        , viewsPath = path.join(conf.staticPathAbsolute, '..', 'views')
        ;

// precompile and cache all templates in given folder
var cacheFolder = function (tmplFolderPath) {
    fs.readdir(tmplFolderPath, function(err, files) {
        files.forEach(function(filename) {
            var lastDot = filename.lastIndexOf('.');
            if (lastDot) {
                var ext = (lastDot < 0) ? '' : filename.substr(lastDot);
                if (ext === '.html') {
                    var templateName = filename.substring(0, lastDot);
                    console.log("compiling template: " + filename);
                    cacheTemplate(tmplFolderPath, templateName);
                }
            }
        });
    });
};

var cacheTemplate = function (tmplFolderPath, templateName) {
    var tmplPath = path.join(tmplFolderPath, templateName + ".html");
    data = fs.readFileSync(tmplPath, 'utf8');
    if (data) {
        tmplCache[templateName] = _.template(data);
        console.log(templateName + " compiled and cached");
    } else {
        console.log("error reading file:" + tmplPath);
        console.log(err);
    }
};

cacheFolder(templatesPath);
cacheFolder(viewsPath);


module.exports = exports = function(tmplName, context) {
    if (!tmplCache[tmplName]) {
        console.log(tmplCache);
        console.log("missing template: " + tmplName);
        return "missing template: " + tmplName;
    } else {
        context = _.extend(_.clone(this), context);
        return tmplCache[tmplName](context);
    }
};
