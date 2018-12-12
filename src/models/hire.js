'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hireSchema = new Schema({
    //details
    author: { type: String, required: true },
    recipient: { type: String, required: true },

    title: { type: String, required: true },
    query_id: { type: String, required: true },
    permlink: { type: String, required: true },
    event: { type: String, required: true },
    relation: { type: String, required: true },

    state: { type: String }, //eg: accepted, declined
    created: { type: Date, required: true, default: Date.now },
});

//use 'post', not 'pre'
//send notification
hireSchema.post('save', async function(next) {
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

hireSchema.index(
    { author: 1, recipient: 1, state: 1, created: 1 },
    { name: 'hire_index' }
);

module.exports = mongoose.model('hireSchema', hireSchema);
