/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

var mongoose = require('mongoose');

module.exports = exports = {
    convert: function(data) {
        var retVal = null;
        if (Object.prototype.toString.call(data) === '[object Array]') {
            retVal = [];
            // array of objects
            for (var i in data) {
                retVal.push(this.convertObject(data[i]));
            }
        } else {
            retVal = convertObject(data);
        }
        return retVal;
    },
    convertObject: function(data) {
        if (data._id) {
            // mongoose to backbone
            data.id = data._id.toString();
            delete data._id;
        } else {
            // backbone to mongoose 
            if (data.id !== 'new') {
                data._id = mongoose.Types.ObjectId(data.id);
            }
            delete data.id;
        }
        return data;
    }
};
