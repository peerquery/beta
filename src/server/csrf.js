
'use strict';

var cookie = require('cookie-parser');
	
module.exports = function (req, res, next) {
	
    res.cookie('_xcsrf', req.csrfToken(), { httpOnly: true });
	
    next();
	
};
