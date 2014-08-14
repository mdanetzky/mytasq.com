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
        ;

var conf = function() {

    this.config = {};

// set development flag
    var development = (process.env.NODE_ENV === 'production' ? false : true);

    var confFileName = development ? 'conf.dev.json' : 'conf.prod.json';
    var confFilePath = path.join(__dirname, '..', confFileName);

    console.log("conf file path: " + confFilePath);
    if (fs.existsSync(confFilePath)) {
        this.config = JSON.parse(fs.readFileSync(confFilePath, 'utf8'));
    } else {
        this.config = {
            err: "NODE_ENV no set!"
        };
    }

    this.config.development = development;

// set absolute path to app root
    this.config.appPathAbsolute = path.join(__dirname, '..');

// set absolute path to static resources
    if (!this.config.staticPathAbsolute) {
        if (!this.config.staticPathRelative) {
            console.log("conf file path: " + confFilePath);
            console.log("Missing staticPath in this.configuration! Exiting");
            process.exit(1);
        }
        // assume - this file lies in lib subfolder of the main app folder
        this.config.staticPathAbsolute = path.join(this.config.appPathAbsolute, this.config.staticPathRelative);
    }
};

conf.instance = null;

conf.getConf = function() {
    if (this.instance === null) {
        this.instance = new conf();
    }
    return this.instance.config;
};

module.exports = exports = conf.getConf();