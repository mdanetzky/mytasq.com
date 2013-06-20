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
    parent: {type: Schema.ObjectId, ref: 'Task', index: true}
    , title: {type: String, default: '', index: true}
    , text: {type: String, default: ''}
    , author: {type: Schema.ObjectId, ref: 'User', index: true}
    , assignee: {type: Schema.ObjectId, ref: 'User', sparse: true}
    , cretionTime: {type: Date, default: Date.now}
    , lastModifiedTime: {type: Date, default: Date.now, index: true}
    , public: {type: Boolean, default: false, index: true}
    , done: {type: Boolean, default: false, index: true}
    , deleted: {type: Boolean, required: true, default: false, index: true}
}, {collection: "mtTasks"});


module.exports = mongoose.model('Task', TaskSchema);
