'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var relationSchema = new Schema({
    //details
    followee: { type: String },
    following: { type: String },
    target: { type: String }, //project, user
    state: { type: String }, //active, inactive(unscribed)
    created: { type: Date, required: true, default: Date.now },
    left: { type: Date, required: true, default: Date.now }, //unsubscripted data
});

relationSchema.index(
    { followee: 1, subject: 1 },
    { following: 1, subject: 1 },
    { name: 'relation_index' }
);

module.exports = mongoose.model('relationSchema', relationSchema);
