
'use strict';

var router = require('../../server/router'),
	address = require('../indexes/address');

module.exports = function(err, req, res, next) {
	
	//console.log('process err (500) : \n' + err);
    return router(address._static._500, req, res);
	
};