
'use strict';

module.exports = function(app) {

	app.get('/@:username', function (req, res) {
        res.render('user/user', {user: req.params.username});
	})
	
	app.get('/@:username/feed', function (req, res) {
        res.render('user/feed');
	})

	app.get('/@:username/community', function (req, res) {
        res.render('user/community');
	})

	app.get('/@:username/wallet', function (req, res) {
        res.render('user/wallet');
	})
	
};