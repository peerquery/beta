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

    interest: { type: String },
    skill: { type: String },
    website: { type: String },

    first_name: { type: String },
    last_name: { type: String },

    position: { type: String },
    company: { type: String },
    industry: { type: String },
    email: { type: String },

    //curation
    curation_approves: { type: Number },
    curation_rejects: { type: Number },
    curation_points: { type: Number },
    curation_earnings: { type: Number },
    curation_votes: { type: Number },

    //messages
    received_messages: { type: Number },
    viewed_messages: { type: Number },

    //hires
    received_hires: { type: Number },
    sent_hires: { type: Number },

    //settings
    messaging: { type: String },
    hiring: { type: String },

    //project memberships
    //membership: [{ type: Schema.Types.ObjectId, ref: 'membershipSchema' }],

    //legacy memberships

    memberships: [
        {
            name: { type: String, required: true },
            state: { type: String, required: true },
            slug_id: { type: String, required: true },
            role: { type: String },
            type: { type: String },
            created: { type: Date, default: Date.now },
            benefactor_rate: { type: Number }, //if greater than 0, then is an active benefactor
            benefactor_created: { type: Date },
            benefactor_label: { type: String }, //only the peer has this
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
    benefactors_count: { type: Number }, //user who have made this user their beneficiary
    beneficiaries_count: { type: Number }, //users who this user has made his/her beneficiaries
    beneficiaries_percentage: { type: Number }, //the total amount of percentage that of reward split that this user gives away

    //thankers
    new_follower_message_title: String,
    new_follower_message_body: String,

    //thankers
    new_benefactor_message_title: String,
    new_benefactor_message_body: String,

    project_membership_count: { type: Number },

    //social
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    github: { type: String },

    //legacy community
    /*
    following: [{ type: Schema.Types.ObjectId, ref: 'peerSchema' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'peerSchema' }],
    */

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
