
'use strict'

var cookie = require('cookie-parser');

module.exports = function (req, res, next) {
	
	if(!req.active_user) {
		
		res.status(401).send('unauthorized access');
		
	} else if(req.active_user && req.active_user == null) {
		
		res.status(401).send('unauthorized access');
			
	} else {
		
		next();
		
	}

}

