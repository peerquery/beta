
'use strict';

module.exports = function (req, res, next) {
    
    var cacheTime = 86400000 * 7;// 7 days
    res.setHeader('Cache-Control', 'public, max-age=' + cacheTime);
    
    next();
    
};
