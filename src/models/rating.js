'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ratingSchema = new Schema({
    //details
    author: { type: String, required: true },
    title: { type: String },
    slug: { type: String, required: true },
    rating: { type: Number },
    description: { type: String, required: true },
    state: { type: String, required: true }, //approved, rejected, pending
    type: { type: String, required: true }, //project, user
    created: { type: Date, required: true, Default: Date.now },
});

ratingSchema.index({ author: 1, slug: 1 });

module.exports = mongoose.model('ratingSchema', ratingSchema);
