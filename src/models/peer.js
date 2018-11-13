'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var peerSchema = new Schema({
    //details
    steemid: { type: Number },
    account: { type: String, required: true, unique: true },
    name: { type: String },
    created: { type: Date, default: Date.now, required: true },
    about: { type: String },
    reputation: { type: String },
    location: { type: String },
    badge: { type: String },

    steem_json_metadata: { type: String },

    //curation
    curation_approves: { type: Number },
    curation_rejects: { type: Number },
    curation_points: { type: Number },
    curation_earnings: { type: Number },
    curation_votes: { type: Number },

    //projects
    memberships: [
        {
            name: { type: String, required: true },
            state: { type: String, required: true },
            slug_id: { type: String, required: true },
            role: { type: String },
            type: { type: String },
            created: { type: Date, default: Date.now },
        },
    ],

    //last_project
    last_project_slug_id: { type: String },
    last_project_title: { type: String },

    //activity
    last_login: { type: Date, default: Date.now },
    last_update: { type: Date, default: Date.now },
    last_report: { type: String },
    last_project: { type: String },
    login_count: { type: Number },

    //stats
    view_count: { type: Number },
    query_count: { type: Number },
    report_count: { type: Number },
    project_count: { type: Number },

    //social
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    github: { type: String },

    //community
    following: [
        {
            id: { type: String },
            url: { type: String },
            created: { type: Date, default: Date.now },
        },
    ],
    followers: [
        {
            id: { type: String },
            url: { type: String },
            created: { type: Date, default: Date.now },
        },
    ],

    //community_stats
    following_count: { type: Number, default: 0 },
    followers_count: { type: Number, default: 0 },
});

peerSchema.index(
    {
        name: 1,
        curation_points: 1,
        curation_approvals: 1,
        curation_earnings: 1,
        location: 1,
    },
    { name: 'peer_index' }
);

module.exports = mongoose.model('peerSchema', peerSchema);
