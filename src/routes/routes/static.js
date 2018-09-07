
'use strict';

var router = require('../../server/router'),
	address = require('../indexes/address');

module.exports = function(app) {
	
	app.get('/create', function (req, res) {
		return router(address._static.create, req, res);
	})
	
	app.get('/contact', function (req, res) {
		return router(address._static.contact, req, res);
	})

	app.get('/abuse', function (req, res) {
		return router(address._static.abuse, req, res);
	})
	
	app.get('/faqs', function (req, res) {
		return router(address._static.faqs, req, res);
	})
	
	app.get('/team', function (req, res) {
		return router(address._static.team, req, res);
	})
	
	app.get('/privacy-policy', function (req, res) {
		return router(address._static.privacy, req, res);
	})
	
	app.get('/full-disclosure', function (req, res) {
		return router(address._static.disclosure, req, res);
	})
	
	app.get('/terms-and-conditions', function (req, res) {
		return router(address._static.terms, req, res);
	})
	
	/*
	app.get('/HNAP1/', function (req, res) {
		console.log(req);
		res.json({eat-this: "#$%#&#^@)#(&@!>?"});
	})
	*/
};