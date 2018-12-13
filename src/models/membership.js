'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var membershipSchema = new Schema({
    //identifier

    identifier: { type: String, required: true, unique: true }, //format: 'account_project_slug_id', eg: 'dzivenu_sjaosSJ09'

    //project details
    title: { type: String, required: true }, //project title
    slug_id: { type: String, required: true, ref: 'projectSchema' },
    role: { type: String },
    type: { type: String },
    steem: { type: String, required: true, ref: 'peerSchema' }, //peer's account

    //user details
    account: { type: String, required: true, ref: 'peerSchema' }, //peer's account
    benefactor_rate: { type: Number }, //if greater than 0, then is an active benefactor
    benefactor_created: { type: Date },
    benefactor_label: { type: String }, //only the peer has this
    benefactor_message: { type: String },

    //other details
    state: { type: String }, //active, inactive
    created: { type: Date, default: Date.now },
});

membershipSchema.index(
    {
        title: 1,
        project: 1,
        account: 1,
        peer: 1,
        slug_id: 1,
        type: 1,
        created: 1,
        benefactor_rate: 1,
        benefactor_created: 1,
        state: 1,
    },
    { name: 'membership_index' }
);

module.exports = mongoose.model('membershipSchema', membershipSchema);
