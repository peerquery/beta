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

    //curation
    curation_daily_limit: Number,
    curation_rest_day1: String,
    curation_rest_day2: String,
    curation_vote_interval_minutes: Number,
    curation_common_comment: String,

    curation_curator_rate: Number,
    curation_team_rate: Number,
    curation_project_rate: Number,
    curation_community_rate: Number,

    //basic team
    owner: String,
    super_admin: String,
    admin: String,

    //uris
    domain: String,
    steem: String,

    last_update: Date,
});

/*, { name: 'setings_index' } */

module.exports = mongoose.model('settingsSchema', settingsSchema);
