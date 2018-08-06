

'use strict';

module.exports = function(app) {

	app.get('/publish', function (req, res) {
        res.render('client/publish');
	})

	app.get('/me', function (req, res) {
        res.render('client/me');
	})


}
 