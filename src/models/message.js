'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    //details
    slug_id: { type: String, required: true, unique: true },

    author: { type: String, required: true },
    recipient: { type: String, required: true },

    title: { type: String, required: true },
    body: { type: String, required: true },

    state: { type: String, required: true }, //eg: viewed, not-viewed
    target: { type: String, required: true }, //eg: project, query, user
    created: { type: Date, required: true, default: Date.now },
});

messageSchema.index(
    { author: 1, recipient: 1, state: 1, target: 1, created: 1 },
    { name: 'message_index' }
);

module.exports = mongoose.model('messageSchema', messageSchema);
