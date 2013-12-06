/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 * 
 * Mongoose model.
 * User.
 */

var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        passportLocalMongoose = require('passport-local-mongoose'),
        log = require('../lib/mt.logger')(module)
        ;

var UserSchema = new Schema({
    nickname: String,
    birthdate: Date
}, {collection: 'mtUsers'});

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    passwordField: 'password'
});

UserSchema.index({email: 1}, { unique: true, sparse: true });

var User = mongoose.model('User', UserSchema);

module.exports = User;
