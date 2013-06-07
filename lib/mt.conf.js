/*
 * MyTasq.com
 * Application definition
 * 
 * Author: Matthias Danetzky
 * 
 * Configuration script loader
 * Scripts must be located in app's root directory.
 * NODE_ENV variable must be set to either development or production
 */

var fs = require('fs')
        , path = require('path')
        , conf = {}
;

var confDev = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'conf.dev.json'), 'utf8'));
var confProd = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'conf.prod.json'), 'utf8'));

switch (process.env.NODE_ENV) {
    case 'development':
        conf = confDev;
        break;
    case 'production':
        conf = confProd;
        break;
    default:
        conf = {err: "NODE_ENV no set!"};
}

// set development flag
conf.development = (process.env.NODE_ENV === 'development' ? true : false);

// set absolute path to static resources
if (!conf.staticPathAbsolute) {
    if (!conf.staticPathRelative) {
        console.log("Missing staticPath in configuration! Exiting");
        process.exit(1);
    }
    // assume - this file lies in lib subfolder of the main app folder
    conf.staticPathAbsolute = path.join(__dirname, conf.staticPathRelative);
}

module.exports = exports = conf;