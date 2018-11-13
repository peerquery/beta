'use strict';

const dsteem = require('dsteem');
const config = require('../configs/config');
const client = new dsteem.Client(config.steem_rpc);
const settings = require('../models/settings');

module.exports = async function() {
    var config = {};

    //console.log('   fetching globals ');

    //get local settings
    var results = await settings
        .findOne({ identifier: 'default' })
        .select(
            'curation_daily_limit curation_rest_day1 curation_rest_day2 curation_vote_interval_minutes curation_bot_account ' +
                ' curation_common_comment curation_curator_rate curation_team_rate curation_project_rate curation_community_rate '
        );

    //console.log(results)

    config.curation_daily_limit = results.curation_daily_limit;
    config.curation_rest_day1 = results.curation_rest_day1;
    config.curation_rest_day2 = results.curation_rest_day2;
    config.curation_vote_interval_minutes =
        results.curation_vote_interval_minutes;
    config.curation_common_comment = results.curation_common_comment;
    config.curation_curator_rate = results.curation_curator_rate;
    config.curation_team_rate = results.curation_team_rate;
    config.curation_project_rate = results.curation_project_rate;
    config.curation_community_rate = results.curation_community_rate;
    config.curation_bot_account = results.curation_bot_account;

    //set global steem values

    var acc = await client.database.getAccounts([results.curation_bot_account]);
    acc = acc[0];

    //console.log(acc)

    //voting_power = acc.voting_power
    config.voting_power = acc.voting_power;

    //calculate full vote(weight at 10000) worth
    var fund = await client.database.call('get_reward_fund', ['post']);
    config.recent_claims = fund.recent_claims;
    config.reward_balance = fund.reward_balance.split(' ')[0];

    var price = await client.database.getCurrentMedianHistoryPrice();
    config.sbd_median_price = price.base.amount;

    var total_vests =
        Number(acc.vesting_shares.split(' ')[0]) +
        Number(acc.received_vesting_shares.split(' ')[0]) -
        Number(acc.delegated_vesting_shares.split(' ')[0]);
    config.final_vest = total_vests * 1e6;

    //console.log(config)

    return config;
};
