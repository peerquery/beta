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

    //curation
    curation_bot_account: String,
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

    //welcomers
    new_user_message_title: String,
    new_user_message_body: String,

    //informations
    new_project_message_title: String,
    new_project_message_body: String,

    //global messages
    global_notification: String,

    //uris
    domain: String,
    steem: String,

    site_start_time: Date,
});

/*, { name: 'setings_index' } */

module.exports = mongoose.model('settingsSchema', settingsSchema);
