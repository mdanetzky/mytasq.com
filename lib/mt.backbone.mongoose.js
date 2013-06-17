/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone <=> Mongoose object converter.
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
            retVal = this.convertObject(data);
        }
        return retVal;
    },
    convertObject: function(data) {
        if (typeof data.save === 'function' && typeof data.isNew === 'boolean'){
            // Mongoose Document to mongoose JSON.
            data = data.toObject();
        }
        if (data._id) {
            // Mongoose JSON to Backbone.
            data.id = data._id.toString();
            delete data._id;
            // Remove mongoose version key.
            delete data.__v;
        } else {
            // Backbone to Mongoose JSON. 
            if (data.id !== 'new') {
                data._id = mongoose.Types.ObjectId(data.id);
            }
            delete data.id;
        }
        return data;
    }
};
