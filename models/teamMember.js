/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Mongoose Model.
 * Team Member.
 */

var mongoose = require('mongoose')
        , Schema = mongoose.Schema
        , User = require('./user')
        , Team = require('./team')
        ;
var TeamMemberSchema = new Schema({
    team: {type: Schema.ObjectId, ref: 'Team', index: true}
    , user: {type: Schema.ObjectId, ref: 'User', index: true}
    , role: {type: String, default: 'member', index: true}
    , cretionTime: {type: Date, default: Date.now}
    , lastModifiedTime: {type: Date, default: Date.now, index: true}
    , deleted: {type: Boolean, required: true, default: false, index: true}
}, {collection: "mtTeamMembers"});
module.exports = mongoose.model('TeamMember', TeamMemberSchema);

