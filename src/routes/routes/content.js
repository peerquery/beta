
'use strict';

var router = require('../../server/router'),
	peer = require('../../models/peer'),
	reports = require('../../models/report'),
	project = require('../../models/project'),
	address = require('../indexes/address');
	
module.exports = function(app) {
	
	app.get('/', function(req, res) {
		return router(address.content.index, req, res);
    });
	
	app.get('/steem', function (req, res) {
		return router(address.content.steem, req, res);
	})
	
	app.get('/@:username', async function (req, res) {
		
		try{
			
			//var query = 'account about report_count project_count created location -_id';
			//var results = await peer.findOne({'account': req.params.username}).select(query);
		
			//res.req_data = results;
			return router(address.content.peer, req, res);
		
		} catch(err) {
			console.log(err);
			return router(address._static._404, req, res);
		}
		
		
	})
	
	app.get('/projects', function (req, res) {
		return router(address.content.projects, req, res);
	})
	
	
	app.get('/project/:project', async function (req, res) {
		
		try{
			
			var query = 'name logo cover mission founder location website owner slug story description member_count created state tag -_id';
			var results = await project.findOne({'slug': req.params.project}).select(query);
			
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
			var results = await project.findOne({'slug': req.params.project}).where('owner').select(query);
		
			if(!results || results == '') return router(address._static._403, req, res);
		
			results.path = '/reports';
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
			var results = await project.findOne({'slug': req.params.project}).select(query);
		
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
			var results = await project.findOne({'slug': req.params.project}).where('owner').equals(req.active_user.account).select(query);
		
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

	app.get('/@:username/:permLink', async function (req, res) {
		
		var find = { url: req.params.username + "/" + req.params.permLink };
		var report = await reports.findOneAndUpdate(find, { $inc: { view_count: 1 } }).select('title summary author view_count -_id');	
		res.req_data = report;
		
		return router(address.content.report_view, req, res);
	})
	
	app.get('/:category/@:username/:permLink', function (req, res) {
		res.redirect("/@" + req.params.username + "/" + req.params.permLink);
	})
	
};