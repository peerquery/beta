
'use strict'

var jwt = require('jsonwebtoken'),
	cookie = require('cookie-parser'),
	secret = Buffer.from(process.env.JWT_SECRET, 'hex');

module.exports = function (req, res, next) {
	
	if(req.signedCookies._auth) {
		
		try {
			var auth = req.signedCookies._auth;
			
			var decoded = jwt.verify(auth, secret);
			//console.log(decoded);
			
			if( decoded && decoded.account && decoded.auth ) {
				
				var active_user = {};
				active_user.account = decoded.account;
				active_user.auth = decoded.auth;
				
				req.active_user = active_user;
				req.body._csrf = req.cookies._xcsrf;
				
				next();
				
			} else {
				
				req.active_user = null;
				req.body._csrf = req.cookies._xcsrf;
				
				next();
				
			}
			
		} catch(err) {
			
			//console.log(err.message);
			res.clearCookie('_auth').redirect('/login');
			
		}
		
	} else {
		
		req.body._csrf = req.cookies._xcsrf;
		next();
		
	}

}
