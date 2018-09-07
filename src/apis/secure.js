
'use strict';

var auth = require('./auth'),
	create = require('./create'),
	update = require('./update');
	
module.exports = async function (app) {
	
	auth(app);
	create(app);
	update(app);
	
}
