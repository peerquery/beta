
'use strict';

module.exports = function(app) {	
	
	app.get('/issues', function (req, res) {
        res.render('issues/issues');
	})

	app.get('/issues/:issue', function (req, res) {
        res.render('issues/issue');
	})
	
};