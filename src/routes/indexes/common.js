'use strict';

var _static = require('../routes/static'),
	robot = require('../helpers/robots');
	
module.exports = async function (app) {
	robot(app);
	_static(app);
}
	