'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var relationSchema = new Schema(
    {
        //details

        identifier: { type: String, required: true, unique: true }, //in the format: followee_follower, eg: 'dzivenu_peerquery'

        state: { type: String }, //active, inactive(subscribed)

        following: { type: String, ref: 'peerSchema', required: true }, //the lucky person being followed
        follower: { type: String, ref: 'peerSchema', required: true }, //the person doing the follow

        benefactor_rate: { type: Number }, //if greater than 0, then is an active benefactor
        benefactor_created: { type: Date },
        benefactor_label: { type: String }, //only the peer has this
        benefactor_message: { type: String },
    },
    {
        timestamps: { createdAt: 'created', updatedAt: 'updated' },
    }
);

relationSchema.index(
    { follower: 1, following: 1, updated: 1 },
    { name: 'relation_index' }
);

module.exports = mongoose.model('relationSchema', relationSchema);
