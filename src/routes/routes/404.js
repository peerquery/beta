
'use strict';

var router = require('../../server/router'),
	address = require('../indexes/address');

module.exports = function(req, res, next) {
	
	if(req.url == '/HNAP1/') console.log(req);
    return router(address._static._404, req, res);
	
};