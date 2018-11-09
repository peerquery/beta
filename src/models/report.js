'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reportSchema = new Schema({
    steemid: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    permlink: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    body: { type: String, required: true },
    meta_description: { type: String },
    created: { type: Date, default: Date.now, required: true },
    updated_at: { type: Date },
    url: { type: String, required: true },
    hidden: Boolean,

    //taxonomy
    category: { type: String, required: true },

    //affiliation
    project_title: { type: String },
    project_slug_id: { type: String },

    //curation
    curation_state: { type: Number }, //-1: rejected , 0: not viewed ,  1: viewed , 2: approved , 3: voted
    curation_comments: { type: String },
    curation_rate: { type: Number },
    curation_curator: { type: String },
    curation_time: { type: Date },

    //stats
    view_count: { type: Number, default: 0 },
    vote_count: { type: Number, default: 0 },
    comment_count: { type: Number, default: 0 },
});

reportSchema.index({
    title: 1,
    url: 1,
    author: 1,
    category: 1,
    permlink: 1,
    project_slug_id: 1,
    view_count: 1,
    vote_count: 1,
    comment_count: 1,
    curation_comments: 1,
    curation_curator: 1,
    curation_rate: 1,
    curation_time: 1,
});

module.exports = mongoose.model('reportSchema', reportSchema);
