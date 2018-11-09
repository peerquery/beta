'use strict';

var db_setup = require('../configs/db');

module.exports = async function() {
    if (await db_setup()) return true;
    return false;
};
