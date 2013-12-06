/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Mongoose Model.
 * Team
 */

var mongoose = require('mongoose')
        , Schema = mongoose.Schema
        , User = require('./user')
        ;
var TeamSchema = new Schema({
    name: {type: String, default: 'new Team', index: true}
    , author: {type: Schema.ObjectId, ref: 'User', index: true}
    , cretionTime: {type: Date, default: Date.now}
    , lastModifiedTime: {type: Date, default: Date.now, index: true}
    , public: {type: Boolean, default: false, index: true}
    , deleted: {type: Boolean, required: true, default: false, index: true}
}, {collection: "mtTeams"});
module.exports = mongoose.model('Team', TeamSchema);
