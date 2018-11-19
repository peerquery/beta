'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var searchSchema = new Schema({
    //details
    query: { type: String },
    type: { type: String }, //eg: project, report, user, query
    author: { type: String },
    created: { type: Date, required: true, default: Date.now },
});

searchSchema.index(
    { author: 1, type: 1, query: 1, created: 1 },
    { name: 'search_index' }
);

module.exports = mongoose.model('searchSchema', searchSchema);
