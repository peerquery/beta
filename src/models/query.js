'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var querySchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    permlink: { type: String, required: true, unique: true },
    image: { type: String },
    description: { type: String, required: true },
    body: { type: String, required: true },
    meta_description: { type: String },
    created: { type: Date, Default: Date.now, required: true },
    deadline: { type: Date, Default: Date.now, required: true },
    reward: Number,
    reward_form: String,
    terms: String,
    telephone: String,
    email: String,
    website: String,
    updated_at: { type: Date },
    url: { type: String, required: true },
    hidden: Boolean,

    //taxonomy
    category: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },

    //affiliation
    project_title: { type: String },
    project_slug_id: { type: String },

    //stats
    view_count: { type: Number, Default: 0 },
    vote_count: { type: Number, Default: 0 },
    comment_count: { type: Number, Default: 0 },
});

querySchema.index({
    title: 1,
    url: 1,
    author: 1,
    category: 1,
    permlink: 1,
    label: 1,
    type: 1,
    deadline: 1,
    reward: 1,
    reward_form: 1,
    project_slug_id: 1,
    view_count: 1,
    vote_count: 1,
    comment_count: 1,
});

module.exports = mongoose.model('querySchema', querySchema);
