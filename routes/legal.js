
'use strict';

module.exports = function(app) {
	
	app.get('/abuse', function (req, res) {
		res.render('legal/abuse');
	})
	
	app.get('/privacy-policy', function (req, res) {
		res.render('legal/privacy-policy');
	})
	
	app.get('/full-disclosure', function (req, res) {
		res.render('legal/full-disclosure');
	})
	
	app.get('/terms-and-conditions', function (req, res) {
		res.render('legal/terms-and-conditions');
	})
	
};