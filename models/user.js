/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    email: {type: String, sparse: true},
    nickname: String,
    birthdate: Date
}, { collection: 'mtUsers' });

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    passwordField: 'password'
});

module.exports = mongoose.model('User', UserSchema);
