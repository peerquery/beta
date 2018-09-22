
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activitySchema = new Schema({
	
    //details
    title: { type: String},
    slug: { type: String},
    slug_id: { type: String},
    action: { type: String },	//eg: create, update, delete, rate, vote, follow
    type: { type: String },		//eg: project, report, user, query
    source: { type: String },		//eg: project, report, user, query
    account: { type: String },
    description: { type: String },
    state: { type: String },
    likes: { type: Number },
    dislikes: { type: Number },
    created: { type: Date, required: true, Default: Date.now }
	
});

activitySchema.index({account: 1});

module.exports = mongoose.model('activitySchema', activitySchema);
