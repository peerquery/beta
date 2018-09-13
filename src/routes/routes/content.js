
'use strict';

var router = require('../../server/router'),
	peers = require('../../models/peer'),
	reports = require('../../models/report'),
	queries = require('../../models/query'),
	projects = require('../../models/project'),
	address = require('../indexes/address');
	
module.exports = function(app) {
	
	app.get('/', function(req, res) {
		return router(address.content.index, req, res);
    });
	
	app.get('/steem', function (req, res) {
		return router(address.content.steem, req, res);
	})
	
	app.get('/@:username', function (req, res) {
		res.redirect("/peer/" + req.params.username);
	})
	
	app.get('/peer/:username', async function (req, res) {
		
		try{
			
			//var query = 'account about report_count project_count created location -_id';
			//var results = await peers.findOne({'account': req.params.username}).select(query);
		
			//res.req_data = results;
			return router(address.content.peer, req, res);
		
		} catch(err) {
			console.log(err);
			return router(address._static._404, req, res);
		}
		
		
	})
	
	app.get('/query/:query', async function (req, res) {
		
		try{
			
			var query = '';
			//var results = await query.findOne({'permlink': req.params.query}).select(query);
			var results = await queries.findOne({'permlink': req.params.query});
		
			res.req_data = results;
			return router(address.content.query, req, res);
		
		} catch(err) {
			console.log(err);
			return router(address._static._404, req, res);
		}
		
		
	})
	
	
	app.get('/projects', function (req, res) {
		return router(address.content.projects, req, res);
	})
	
	
	app.get('/queries', function (req, res) {
		return router(address.content.queries, req, res);
	})
	
	
	app.get('/queries/:query', async function (req, res) {
		
		try{
			
			var query = 'name logo cover mission founder location website owner slug story description member_count created state tag -_id';
			var results = await query.findOne({'slug': req.params.query}).select(query);
			
			if(!results || results == '') return router(address._static._404, req, res);
			
			results.path = '/';
			res.req_data = results;
			return router(address.content.query, req, res);
		
		} catch(err) {
			console.log(err);
			return router(address._static._500, req, res);
		}
		
	})
	
	
	app.get('/project/:project', async function (req, res) {
		
		try{
			
			var query = 'name logo cover mission founder location website owner slug story description member_count created state tag -_id';
			var results = await projects.findOne({'slug': req.params.project}).select(query);
			
			if(!results || results == '') return router(address._static._404, req, res);
		
			results.path = '/';
			res.req_data = results;
			return router(address.content.project, req, res);
		
		} catch(err) {
			console.log(err);
			return router(address._static._500, req, res);
		}
		
	})
	
	
	app.get('/project/:project/reports', async function (req, res) {
		
		try{
			
			var query = 'name logo cover mission founder location website owner slug story description member_count created state tag -_id';
			//the below clause makes sure only the project owner can access this route
			var results = await projects.findOne({'slug': req.params.project}).select(query);
		
			if(!results || results == '') return router(address._static._403, req, res);
		
			results.path = '/reports';
			res.req_data = results;
			return router(address.content.project, req, res);
		
		} catch(err) {
			console.log(err);
			return router(address._static._500, req, res);
		}
		
	})
	
	
	app.get('/project/:project/queries', async function (req, res) {
		
		try{
			
			var query = 'name logo cover mission founder location website owner slug story description member_count created state tag -_id';
			//the below clause makes sure only the project owner can access this route
			var results = await projects.findOne({'slug': req.params.project}).select(query);
			
			if(!results || results == '') return router(address._static._403, req, res);
		
			results.path = '/queries';
			res.req_data = results;
			return router(address.content.project, req, res);
		
		} catch(err) {
			console.log(err);
			return router(address._static._500, req, res);
		}
		
	})
	
	app.get('/project/:project/members', async function (req, res) {
		
		try{
			
			var query = 'name logo cover mission founder location website owner slug story description member_count created state tag -_id';
			//the below clause makes sure only the project owner can access this route
			var results = await projects.findOne({'slug': req.params.project}).select(query);
		
			if(!results || results == '') return router(address._static._403, req, res);
		
			results.path = '/members';
			res.req_data = results;
			return router(address.content.project, req, res);
		
		} catch(err) {
			console.log(err);
			return router(address._static._500, req, res);
		}
		
	})
	
	app.get('/project/:project/settings', async function (req, res) {
		
		try{
			
			var query = 'name logo cover mission founder location website owner slug story description member_count created state tag -_id';
			//the below clause makes sure only the project owner can access this route
			var results = await projects.findOne({'slug': req.params.project}).where('owner').equals(req.active_user.account).select(query);
		
			if(!results || results == '') return router(address._static._403, req, res);
		
			results.path = '/settings';
			res.req_data = results;
			return router(address.content.project, req, res);
		
		} catch(err) {
			console.log(err);
			return router(address._static._500, req, res);
		}
		
	})
	
	app.get('/reports', function (req, res) {
		return router(address.content.reports, req, res);
	})

	app.get('/peers', function (req, res) {
		return router(address.content.peers, req, res);
	})

	app.get('/report/:report', async function (req, res) {
		
		var find = { permlink: req.params.report };
		var report = await reports.findOneAndUpdate(find, { $inc: { view_count: 1 } }).select('title summary author view_count -_id');	
		res.req_data = report;
		
		return router(address.content.report, req, res);
	})
	
	app.get('/@:username/:permLink', async function (req, res) {
		res.redirect("/report/" + req.params.username + "-" + req.params.permLink);
	})
	
	app.get('/:category/@:username/:permLink', function (req, res) {
		res.redirect("/report/" + req.params.username + "-" + req.params.permLink);
	})
	
};