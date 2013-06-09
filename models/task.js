/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

var mongoose = require('mongoose')
        , Schema = mongoose.Schema
        , User = require('./user')
        ;

// Define schema
var TaskSchema = new Schema({
    title: {type: String, default: ''}
    , text: {type: String, default: ''}

    , author: {type: Schema.ObjectId, ref: 'User'}
    , cretionTime: {type: Date, default: Date.now}
    , lastModifiedTime: {type: Date, default: Date.now}
    , public: {type: Boolean, default: false}
    , done: {type: Boolean, default: false}
}, {collection: "mtTasks"});


module.exports = mongoose.model('Task', TaskSchema);
