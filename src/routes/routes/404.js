
'use strict';

var router = require('../../server/router'),
    address = require('../indexes/address');

module.exports = function(req, res, next) {
	
    res.status(404);
    return router(address._static._404, req, res);
	
};