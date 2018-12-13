'use strict';

const config = require('../configs/scripts'),
    migrate_membership = require('./migrate-membership/index'),
    force_steem_account = require('./force/steem-account'),
    force_membership_titles = require('./force/membership-titles');

module.exports = async function() {
    if (config.migrate_membership) await migrate_membership();
    if (config.force_steem_account) await force_steem_account();
    if (config.force_membership_titles) await force_membership_titles();
    return true;
};
