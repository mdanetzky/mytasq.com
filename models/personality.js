/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define schema
var PersonalitySchema = new Schema({
    name : { type: String, required: true}

  , cretionTime: { type : Date, default: Date.now }
  , user: {type: Schema.ObjectId, ref: 'UserSchema'}
});


module.exports = mongoose.model('Personality', TaskSchema);
