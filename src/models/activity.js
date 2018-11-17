'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activitySchema = new Schema({
    //details
    title: { type: String },
    slug: { type: String },
    indentifier: { type: String, unique: true },
    slug_id: { type: String },
    action: { type: String }, //eg: create, update, delete, rate, vote, follow
    type: { type: String }, //eg: project, report, user, query
    source: { type: String }, //eg: project, report, user, query
    account: { type: String },
    description: { type: String },
    state: { type: String },
    subject: { type: String },
    value: { type: Number },
    likes: { type: Number },
    dislikes: { type: Number },
    created: { type: Date, required: true, default: Date.now },
});

activitySchema.index(
    { account: 1, subject: 1, type: 1, slug_id: 1, action: 1, created: 1 },
    { name: 'activity_index' }
);

module.exports = mongoose.model('activitySchema', activitySchema);
