
"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var projectSchema = new Schema({
	
	//details
	name: { type: String, required: true},
	description: { type: String, require: true },
	founder: { type: String, required: true },
	owner: { type: String, required: true },
	logo: { type: String },
	cover: { type: String},
	
	slug: { type: String, unique: true, required: true},
	slug_id: { type: String, unique: true, required: true},
	title: { type: String, unique: true, required: true},
	
	mission: { type: String },
	story: { type: String, required: true },
    verified: { type: Boolean, default: false },
	website: { type: String },
	location: { type: String },
	steem: { type: String },
	created: { type: Date, required: true, Default: Date.now },
	last_update: { type: Date, required: true, Default: Date.now },
	
    //taxanomy
	type: { type: String, required: true},
	state: { type: String },
	tag: { type: String },
	
	//activity
	last_report: { type: Number },
	
	//stats
	view_count: { type: Number },
	report_count: { type: Number},
	
	//ratings
	ratings_count: { type: Number },
	ratings_value: { type: Number },
	
	//social
	facebook: { type: String },
	twitter: { type: String },
	github: { type: String },
	chat: { type: String },
	
	//reports
	reports: [{
					title: { type: String, required: true  },
					account: { type: String, required: true  },
					permlink: { type: String, required: true  },
					created: { type: Date, default: Date.now }
				}],
				
	//community
	sponsors: [{
					account: { type: String, required: true, unique: true },
					created: { type: Date, default: Date.now }
				}],
	team: [{
					account: { type: String, required: true, unique: true },
					role: { type: String, required: true  },
					created: { type: Date, default: Date.now }
				}],
	members: [{
					account: { type: String, required: true, unique: true },
					created: { type: Date, default: Date.now }
				}],
	following: [{
					account: { type: String, required: true, unique: true },
					created: { type: Date, default: Date.now }
				}],
	followers: [{
					account: { type: String, required: true, unique: true },
					created: { type: Date, default: Date.now }
				}],
	
	//community_stats
	sponsors_count: { type: Number, Default: 0 },
	member_count: { type: Number, Default: 0 },
	following_count: { type: Number, Default: 0 },
	followers_count: { type: Number, Default: 0 }
	
})


projectSchema.index({name: 1, owner: 1, state:1, type: 1, tag: 1, verified: 1, title: 1, slug: 1, slug_id: 1 });

module.exports = mongoose.model('projectSchema', projectSchema);
