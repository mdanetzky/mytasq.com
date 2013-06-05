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
    title: {type: String, default: 'New task'}
    , text: {type: String, default: 'Description of New task'}

//    , author: {type: mongoose.Types.ObjectId, ref: 'User'}
    , cretionTime: {type: Date, default: Date.now}
    , lastChangeTime: {type: Date, default: Date.now}
    , public: {type: Boolean, default: false}
}, {collection: "mtTasks"});


module.exports = mongoose.model('Task', TaskSchema);
