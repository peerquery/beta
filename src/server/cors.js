'use strict';

module.exports = function(req, res, next) {
    var allowedOrigins = [
        'http://localhost',
        'https://peerquery.com',
        'https://www.peerquery.com',
    ];
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Cache-Control', 'no-cache');
    res.header('Access-Control-Allow-Credentials', true);

    next();
};
