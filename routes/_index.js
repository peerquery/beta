'use strict';

var client = require('./client'),
	robot = require('./robots'),
	legal = require('./legal'),
	user = require('./user'),
	_static = require('./static'),
	reports = require('./reports');
	
module.exports = async function (app) {
	
	client(app);
	robot(app);
	legal(app);
	_static(app);
	user(app);
	
	//always mount this router last, else will overide some of the routes handled above 
	reports(app);
	
}
	