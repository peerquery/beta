
'use strict';

var content = require('./content'),
    test = require('./test');
	
module.exports = async function (app) {
	
    content(app);
    test(app);
	
};
	