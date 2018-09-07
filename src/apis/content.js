
'use strict';

var projects = require('../models/project'),
	reports = require('../models/report'),
	users = require('../models/peer');
	
module.exports = async function (app) {
	
	app.get('/api/fetch/projects/featured/:last_id', async function(req, res){
		
		try {
			if(req.params.last_id == 0) {
				var query = 'name owner slug description logo location report_count member_count created state tag';
				var options1  = { steem: { "$nin": [ null, "" ] }, website: { "$nin": [ null, "" ] }, facebook: { "$nin": [ null, "" ] } };
				var results = await projects.find(options1).select(query).limit(20).sort({ created: -1 });
				res.status(200).json(results);
			} else {
				var query = 'name owner slug description logo location report_count member_count created state tag';
				var options2  = { steem: { "$nin": [ null, "" ] }, website: { "$nin": [ null, "" ] }, facebook: { "$nin": [ null, "" ] }, '_id': {'$gt': req.params.last_id} };
				var results = await projects.find(options2).select(query).limit(20).sort({ created: -1 });
				res.status(200).json(results);
			}
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	app.get('/api/fetch/projects/active/:last_id', async function(req, res){
		
		try {
			if(req.params.last_id == 0) {
				var query = 'name owner slug description logo location report_count member_count created state tag';
				var results = await projects.find({state: 'active'}).select(query).limit(20).sort({ created: -1 });
				res.status(200).json(results);
			} else {
				var query = 'name owner slug description logo location report_count member_count created state tag';
				var results = await projects.find({ state: 'active', '_id': {'$gt': req.params.last_id} }).select(query).limit(20).sort({ created: -1 });
				res.status(200).json(results);
			}
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	app.get('/api/fetch/projects/hibernation/:last_id', async function(req, res){
		
		try {
			if(req.params.last_id == 0) {
				var query = 'name owner slug description logo location report_count member_count created state tag';
				var results = await projects.find({state: 'hibernation'}).select(query).limit(20).sort({ created: -1 });
				res.status(200).json(results);
			} else {
				var query = 'name owner slug description logo location report_count member_count created state tag';
				var results = await projects.find({ state: 'hibernation', '_id': {'$gt': req.params.last_id} }).select(query).limit(20).sort({ created: -1 });
				res.status(200).json(results);
			}
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	app.get('/api/fetch/projects/created/:last_id', async function(req, res){
		
		try {
			if(req.params.last_id == 0) {
				var query = 'name owner slug description logo location report_count member_count created state tag';
				var results = await projects.find().select(query).limit(20).sort({ created: -1 });
				res.status(200).json(results);
			} else {
				var query = 'name owner slug description logo location report_count member_count created state tag';
				var results = await projects.find({ '_id': {'$gt': req.params.last_id} }).select(query).limit(20).sort({ created: -1 });
				res.status(200).json(results);
			}
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	app.get('/api/fetch/projects/random/:last_id', async function(req, res){
		
		try {
			var query = 'name owner slug description logo location report_count member_count created state tag';
			var results = await projects.aggregate([ { $sample: { size: 20 } } ]);
			res.status(200).json(results);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	app.get('/api/fetch/users/builders/:last_id', async function(req, res){
		
		try {
			if(req.params.last_id == 0) {
				var query = 'account about last_project_slug_id last_project_title badge created state';
				var results = await users.find({"project_count" : {'$gt': 0 } }).select(query).limit(20).sort({ created: -1 });
				res.status(200).json(results);
			} else {
				var query = 'account about last_project_slug_id last_project_title badge created state';
				var results = await users.find({"project_count" :  {'$gt': 0 }, '_id': {'$gt': req.params.last_id} }).select(query).limit(20).sort({ created: -1 });
				res.status(200).json(results);
			}
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	app.get('/api/fetch/users/reporters/:last_id', async function(req, res){
		
		try {
			if(req.params.last_id == 0) {
				var query = 'account about last_project_slug_id last_project_title badge created state';
				var results = await users.find({"project_count" : 0 , "report_count" : {'$gt': 0 }}).select(query).limit(20).sort({ created: -1 });
				res.status(200).json(results);
			} else {
				var query = 'account about last_project_slug_id last_project_title badge created state';
				var results = await users.find({"project_count" : 0, "report_count" : {'$gt': 0 }, '_id': {'$gt': req.params.last_id} }).select(query).limit(20).sort({ created: -1 });
				res.status(200).json(results);
			}
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	app.get('/api/fetch/users/observers/:last_id', async function(req, res){
		
		try {
			if(req.params.last_id == 0) {
				var query = 'account about last_project_slug_id last_project_title badge created state';
				var results = await users.find({"project_count" : 0, "report_count" : 0}).select(query).limit(20).sort({ created: -1 });
				res.status(200).json(results);
			} else {
				var query = 'account about last_project_slug_id last_project_title badge created state';
				var results = await users.find({"project_count" : 0, "report_count" : 0, '_id': {'$gt': req.params.last_id} }).select(query).limit(20).sort({ created: -1 });
				res.status(200).json(results);
			}
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	
	app.get('/api/project/:slug/home', async function(req, res){
		
		try {
			var query = 'story -_id';
			var results = await projects.find({'slug': req.params.slug}).select(query);
			res.status(200).json(results);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	app.get('/api/private/project/:slug/settings', async function(req, res){
		
		try {
			
			var query = ' -created -followers -following -founder -last_update -member_count -team -reports -members -owner -report_count -slug -sponsors -verified -_id';
			
			//the below clause makes sure only the project owner can access this api
			var results = await projects.find({'slug': req.params.slug}).where('owner').equals(req.active_user.account).select(query);
			
			if(!results || results == '') res.status(403).send('Sorry, you have no right to access this route');
			
			res.status(200).json(results);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	
	app.get('/api/private/projects/list', async function(req, res){
		
		try {
			
			var query = 'name title slug -_id';
			
			//the below clause makes sure only the project owner can access this api
			var results = await projects.find({'owner': req.active_user.account}).select(query);
			
			if(!results || results == '') res.status(403).send('Sorry, you have no projects');
			
			res.status(200).json(results);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	
	
	
	
	
	//featured, viewed, voted, comment, created
	
	app.get('/api/reports/featured/:last_id', async function(req, res){
		
		try {
			var start = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000));	//seven days ago
			var find = { "created_at": { "$gte": start }, project_slug_id: { "$nin": [ null, "" ]} };
			
			var query = 'author permlink id';
			if(req.params.last_id == 0) {
				var results = await reports.find(find).select(query).limit(20).sort({ created_at: -1 });
				res.status(200).json(results);
			} else {
				find = { "created_at": { "$gte": start }, project_slug_id: { "$nin": [ null, "" ]}, '_id': {'$gt': req.params.last_id} };
				var results = await reports.find(find).select(query).limit(20).sort({ created_at: -1 });
				res.status(200).json(results);
			}
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	app.get('/api/reports/created/:last_id', async function(req, res){
		
		try {
			var start = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000));	//seven days ago
			var find = { "created_at": { "$gte": start } };
			
			var query = 'author permlink id';
			if(req.params.last_id == 0) {
				var results = await reports.find(find).select(query).limit(20).sort({ created_at: -1 });
				res.status(200).json(results);
			} else {
				find = { "created_at": { "$gte": start }, '_id': {'$gt': req.params.last_id} };
				var results = await reports.find(find).select(query).limit(20).sort({ created_at: -1 });
				res.status(200).json(results);
			}
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	app.get('/api/reports/popular/:last_id', async function(req, res){
		
		try {
			var start = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000));	//seven days ago
			var find = { "created_at": { "$gte": start } };
			
			var query = 'author permlink id';
			if(req.params.last_id == 0) {
				var results = await reports.find(find).select(query).limit(20).sort({ view_count: 1 });
				res.status(200).json(results);
			} else {
				find = { "created_at": { "$gte": start }, '_id': {'$gt': req.params.last_id} };
				var results = await reports.find(find).select(query).limit(20).sort({ view_count: 1 });
				res.status(200).json(results);
			}
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	app.get('/api/reports/trending/:last_id', async function(req, res){
		
		try {
			var start = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000));	//seven days ago
			var find = { "created_at": { "$gte": start } };
			
			var query = 'author permlink id';
			if(req.params.last_id == 0) {
				var results = await reports.find(find).select(query).limit(20).sort({ vote_count: 1 });
				res.status(200).json(results);
			} else {
				find = { "created_at": { "$gte": start }, '_id': {'$gt': req.params.last_id} };
				var results = await reports.find(find).select(query).limit(20).sort({ vote_count: 1 });
				res.status(200).json(results);
			}
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	app.get('/api/reports/discussed/:last_id', async function(req, res){
		
		try {
			var start = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000));	//seven days ago
			var find = { "created_at": { "$gte": start } };
			
			var query = 'author permlink id';
			if(req.params.last_id == 0) {
				var results = await reports.find(find).select(query).limit(20).sort({ comment_count: 1 });
				res.status(200).json(results);
			} else {
				find = { "created_at": { "$gte": start }, '_id': {'$gt': req.params.last_id} };
				var results = await reports.find(find).select(query).limit(20).sort({ comment_count: 1 });
				res.status(200).json(results);
			}
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	//reports by user
	app.get('/api/reports/user/:username/:last_id', async function(req, res){
		
		try {
			var find = { "author": req.params.username };
			
			var query = 'author permlink id';
			if(req.params.last_id == 0) {
				var results = await reports.find(find).select(query).limit(20).sort({ created_at: -1 });
				res.status(200).json(results);
			} else {
				find = { "author": req.params.username, '_id': {'$gt': req.params.last_id} };
				var results = await reports.find(find).select(query).limit(20).sort({ created_at: -1 });
				res.status(200).json(results);
			}
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	//reports by project
	app.get('/api/reports/project/:project_slug_id/:last_id', async function(req, res){
		
		try {
			var find = { "project_slug_id": req.params.project_slug_id };
			
			var query = 'author permlink id';
			if(req.params.last_id == 0) {
				var results = await reports.find(find).select(query).limit(20).sort({ created_at: -1 });
				res.status(200).json(results);
			} else {
				find = { "project_slug_id": req.params.project_slug_id, '_id': {'$gt': req.params.last_id} };
				var results = await reports.find(find).select(query).limit(20).sort({ created_at: -1 });
				res.status(200).json(results);
			}
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	//members of project
	app.get('/api/members/project/:project_slug_id', async function(req, res){
		
		try {
			var find = { "slug_id": req.params.project_slug_id };
			
			var results = await projects.findOne(find, {members: 1}).limit(20).sort({ created: 1 });
			res.status(200).json(results);
			
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
		
	});
	
	
}
	