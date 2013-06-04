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
    title: {type: String, required: true, default: 'New task'}
    , text: {type: String, unique: true, default: 'Description of New task'}

    , author: {type: ObjectId, ref: 'User'}
    , cretionTime: {type: Date, default: Date.now}
    , lastChangeTime: {type: Date, default: Date.now}
    , public: {type: Boolean, default: false}
    , hash: {type: String, required: true}
}, {collection: "mtTasks"});


module.exports = mongoose.model('Task', TaskSchema);
