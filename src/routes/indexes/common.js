'use strict';

var _static = require('../routes/static'),
	robot = require('../helpers/robots'),
	sitemap = require('../helpers/sitemap');
	
module.exports = async function (app) {
	robot(app);
	sitemap(app);
	_static(app);
}
	