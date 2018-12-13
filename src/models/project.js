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
    steem: { type: String, required: true },
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

    //welcomers
    new_member_message_title: String,
    new_member_message_body: String,

    //thankers
    new_benefactor_message_title: { type: String },
    new_benefactor_message_body: { type: String },

    //action button
    act_msg: { type: String },
    act_uri: { type: String },
    act_type: { type: String },

    //activity
    last_report: { type: Number },

    //stats
    pending_count: { type: Number },
    view_count: { type: Number },
    report_count: { type: Number },
    query_count: { type: Number },
    benefactors_count: Number,

    //ratings
    ratings_count: { type: Number },
    ratings_value: { type: Number },

    received_messages: { type: Number },
    viewed_messages: { type: Number },

    //social
    facebook: { type: String },
    twitter: { type: String },
    github: { type: String },
    chat: { type: String },

    //projects memberships
    //membership: [{ type: Schema.Types.ObjectId, ref: 'membershipSchema' }],

    //legacy memberships

    members: [
        {
            account: { type: String, required: true },
            created: { type: Date, default: Date.now },
            state: { type: String, required: true }, //pending, active, blacklist
            type: { type: String },
            role: { type: String },
            comment: { type: String },
            benefactor_rate: { type: Number }, //if greater than 0, then is an active benefactor
            benefactor_created: { type: Date },
            benefactor_message: { type: String },
        },
    ],

    //community_stats
    member_count: { type: Number, default: 0 },
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
