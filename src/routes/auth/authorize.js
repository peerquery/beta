
'use strict'

module.exports = function (req, res, next) {
	
	if(!req.active_user) {
		
		res.redirect("/login");
		
	} else if(req.active_user && req.active_user == null) {
		
			res.redirect("/login");
			
	} else {
		
		next();
		
	}

}

