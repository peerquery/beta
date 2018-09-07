
"use strict";

var mongoose = require("mongoose"),
	Schema = mongoose.Schema;

var statsSchema = new Schema({
		
        //accounts counter
        accounts_created: Number,
        accounts_deleted: Number,
        
        //projects counter
        projects_created: Number,
        projects_deleted: Number,
        
        //queries counter
        queries_created: Number,
        queries_deleted: Number,
        
        //reports counter
        reports_created: Number,
        reports_deleted: Number,
        
		//activity metrics
		login_count: Number,
		
		//views metrics
		total_view_count: Number,
		project_view_count: Number,
		report_view_count: Number,
		query_view_count: Number,
		users_view_count: Number,
		reviews_view_count: Number
		
		//project metrics
		user_count: Number,
		project_count: Number,
		report_count: Number,
		query_count: Number,
		review_count: Number
		
		//finance metrics
		steem_power_delegators_count: Number,
		total_steem_power_delegation: Number,
		
		//team metrics
		total_team: Number,
		total_moderators: Number,
		total_curators: Number,
		
		
	},{
		//has to be a single document
		collection:'statsSchema',
		capped: { size: 1024, max: 1}
	
})

module.exports = mongoose.model('statsSchema', statsSchema);
