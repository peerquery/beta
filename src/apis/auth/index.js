'use strict';

var auth = require('./auth');

module.exports = function(app) {
    auth(app);
};
