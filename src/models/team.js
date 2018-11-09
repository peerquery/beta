'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var teamSchema = new Schema({
    //account
    name: String,
    account: { type: String, unique: true, required: true },
    email: String,
    created: Date,
    about: String,

    //taxonomy
    role: String, //owner, admin, moderator, curator, blogger, developer, supporter
    label: String,

    //stats
    blog_count: Number,
    curation_count: Number,

    //connections
    facebook: String,
    twitter: String,
    linkedin: String,
    github: String,
});

teamSchema.index({
    name: 1,
    role: 1,
});

module.exports = mongoose.model('teamSchema', teamSchema);
