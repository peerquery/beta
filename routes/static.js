
'use strict';

module.exports = function(app) {

	app.get('/', function(req, res) {
		if(req.cookies.SC2A) { 
			res.render('static/index', { logged_in: "true" } )
		} else {
			res.render('static/index', { logged_in: "false" } );
		}
    });

	app.get('/steem', function (req, res) {
		res.render('static/steem');
	})
	
	app.get('/contact', function (req, res) {
		res.render('static/contact');
	})

};