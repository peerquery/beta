'use strict';

var membership = require('./membership');
var migrate = require('./migrate');

module.exports = async function() {
    if (await migrate()) if (await membership()) return true;
};
