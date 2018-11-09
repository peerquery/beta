'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
    //details
    name: { type: String, required: true },
    description: { type: String, require: true },
    founder: { type: String, required: true },
    owner: { type: String, required: true },
    logo: { type: String },
    cover: { type: String },

    slug: { type: String, unique: true, required: true },
    slug_id: { type: String, unique: true, required: true },
    title: { type: String, unique: true, required: true },

    mission: { type: String },
    story: { type: String, required: true },
    verified: { type: Boolean, default: false },
    website: { type: String },
    location: { type: String },
    steem: { type: String },
    created: { type: Date, required: true, default: Date.now },
    last_update: { type: Date, required: true, default: Date.now },

    //theme
    color: { type: String },

    //taxanomy
    type: { type: String, required: true },
    state: { type: String },
    tag: { type: String },

    //permissions
    member_reporting: { type: Boolean, default: false },
    member_quering: { type: Boolean, default: false },
    member_approving: { type: Boolean, default: false },

    //action button
    act_msg: { type: String },
    act_uri: { type: String },
    act_type: { type: String },

    //activity
    last_report: { type: Number },

    //stats
    view_count: { type: Number },
    report_count: { type: Number },
    query_count: { type: Number },

    //ratings
    ratings_count: { type: Number },
    ratings_value: { type: Number },

    //social
    facebook: { type: String },
    twitter: { type: String },
    github: { type: String },
    chat: { type: String },

    //community
    sponsors: [
        {
            account: { type: String, required: true },
            created: { type: Date, default: Date.now },
        },
    ],
    members: [
        {
            account: { type: String, required: true },
            created: { type: Date, default: Date.now },
            state: { type: String, required: true }, //pending, active, blacklist
            type: { type: String },
            role: { type: String },
            comment: { type: String },
        },
    ],
    followers: [
        {
            account: { type: String, required: true },
            created: { type: Date, default: Date.now },
        },
    ],

    //community_stats
    sponsor_count: { type: Number, default: 0 },
    member_count: { type: Number, default: 0 },
    follower_count: { type: Number, default: 0 },
});

projectSchema.index(
    {
        name: 1,
        founder: 1,
        owner: 1,
        state: 1,
        type: 1,
        tag: 1,
        verified: 1,
        title: 1,
        slug: 1,
        slug_id: 1,
        query_count: 1,
        view_count: 1,
        member_count: 1,
    },
    { name: 'project_index' }
);

module.exports = mongoose.model('projectSchema', projectSchema);
