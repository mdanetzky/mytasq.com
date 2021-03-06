/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Backbone <=> Mongoose object converter.
 */

var mongoose = require('mongoose');

module.exports = exports = {
    // Converts objects between Backbone JSON and Mongoose JSON/Document
    // Automatically recognizes type.
    // Output: Backbone JSON or Mongoose JSON.
    // Input: single objects or arrays of Backbone JSON, Mongoose JSON or Mongoose Documents.
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
        if (this.isMongooseDoc(data) || this.isMongooseJSON(data)) {
            // Mongoose Doc/JSON -> Backbone JSON.
            data = this.convertToBackboneJSON(data);
        } else {
            if (this.isBackboneJSON(data)) {
                // Backbone JSON -> Mongoose JSON.
                data = this.convertToMongooseJSON(data);
            }
        }
        return data;
    },
    convertToMongooseJSON: function(data) {
        if (this.isBackboneJSON(data)) {
            // Backbone JSON -> Mongoose JSON.
            if (data.id !== 'new') {
                data._id = this.toMongooseId(data.id);
            }
            delete data.id;
        }
        if (this.isMongooseDoc(data)) {
            // Mongoose Doc -> Mongoose JSON.
            data = data.toObject();
        }
        return data;
    },
    convertToBackboneJSON: function(data) {
        if (this.isMongooseDoc(data)) {
            // Mongoose Doc -> Mongoose JSON.
            data = this.convertToMongooseJSON(data);
        }
        if (this.isMongooseJSON(data)) {
            // Mongoose JSON -> Backbone JSON.
            data.id = data._id.toString();
            delete data._id;
            // Remove mongoose version key.
            delete data.__v;
        }
        return data;
    },
    isBackboneJSON: function(data) {
        if (data.id && !data._id && typeof data.save !== 'function' && typeof data.isNew !== 'boolean') {
            return true;
        }
        return false;
    },
    isMongooseJSON: function(data) {
        if (!data.id && data._id && typeof data.save !== 'function' && typeof data.isNew !== 'boolean') {
            return true;
        }
        return false;
    },
    isMongooseDoc: function(data) {
        if (typeof data.save === 'function' && typeof data.isNew === 'boolean') {
            return true;
        }
        return false;
    },
    isMongooseIdString: function(id) {
        return id.match(/^[0-9a-fA-F]{24}$/);
    },
    toMongooseId: function(str) {
        if (this.isMongooseIdString(str)) {
            return mongoose.Types.ObjectId(str);
        } else {
            return null;
        }
    }
};
