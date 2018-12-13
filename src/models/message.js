'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    //details
    slug_id: { type: String, required: true, unique: true },
    parent: { type: String },

    author: { type: String, required: true },
    recipient: { type: String, required: true },

    title: { type: String, required: true },
    body: { type: String, required: true },

    event: { type: String },

    state: { type: String, required: true }, //eg: viewed, not-viewed
    relation: { type: String, required: true }, //eg: project, query, user
    created: { type: Date, required: true, default: Date.now },
});

//use 'post', not 'pre'
//send notification
messageSchema.post('save', async function(next) {
    if (!this.event) return next();

    var notification = this.model('notificationSchema');

    var newNotification = notification({
        event: this.event,
        from: this.author,
        to: this.recipient,
        relation: this.relation,
        status: 'pending',
        created: Date.now(),
    });

    await newNotification.save();
});

messageSchema.index(
    { author: 1, recipient: 1, state: 1, relation: 1, created: 1 },
    { name: 'message_index' }
);

module.exports = mongoose.model('messageSchema', messageSchema);
