'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var settingsSchema = new Schema({
    //static id - to ensure there is always only one 'settings' document
    identifier: { type: String, unique: true, required: true },

    //meta
    name: String,
    description: String,
    account: { type: String, required: true },
    email: { type: String },

    //bot rates
    community: Number,
    team: Number,
    project: Number,

    //bot configs
    bot_vote_interval: Number,
    bot_comment_after_vote: Boolean,
    bot_rest_day: String,
    bot_key: String,

    //basic team
    owner: String,
    admin: String,

    //uris
    domain: String,
    steem: String,

    last_update: Date,
});

module.exports = mongoose.model('settingsSchema', settingsSchema);
