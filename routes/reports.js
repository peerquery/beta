

'use strict';

module.exports = function(app) {

	app.get('/reports', function (req, res) {
		res.render('reports/reports');
	})

	app.get('/@:username/:permLink', function (req, res) {
        res.render('reports/report-view');
	})
	
	app.get('/:category/@:username/:permLink', function (req, res) {
		res.redirect("/@" + req.params.username + "/" + req.params.permLink);
	})
	
}
 