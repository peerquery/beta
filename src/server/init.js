'use strict';

var db_setup = require('../scripts/db-init'),
    scripts = require('../scripts/index');

module.exports = async function() {
    await scripts();
    if (await db_setup()) return true;
    return false;
};
