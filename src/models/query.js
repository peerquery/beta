'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var querySchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    query_id: { type: String, required: true, unique: true },
    permlink: { type: String, required: true, unique: true },
    image: { type: String },
    description: { type: String, required: true },
    body: { type: String },
    meta_description: { type: String },
    created: { type: Date, default: Date.now, required: true },
    deadline: { type: Date, default: Date.now, required: true },
    reward: Number,
    reward_form: String,
    terms: String,
    telephone: String,
    email: String,
    website: String,
    updated_at: { type: Date },
    hidden: Boolean,

    //taxonomy
    type: { type: String, required: true },
    label: { type: String, required: true },

    //affiliation
    project_title: { type: String },
    project_slug_id: { type: String },

    //stats
    view_count: { type: Number },
    vote_count: { type: Number },
    comment_count: { type: Number },
});

querySchema.index(
    {
        title: 1,
        author: 1,
        permlink: 1,
        label: 1,
        type: 1,
        deadline: 1,
        reward_form: 1,
        project_slug_id: 1,
        view_count: 1,
    },
    { name: 'query_index' }
);

module.exports = mongoose.model('querySchema', querySchema);
