'use strict';

var dsteem = require('dsteem'),
    config = require('./../../../src/configs/config'),
    calc_voting_power = require('./../../../src/lib/helpers/voting-power'),
    client = new dsteem.Client(config.steem_api);

async function calc() {
    try {
        const account_steem_datas = await client.database.getAccounts([
            config.steem_account,
        ]);

        const account_steem_data = account_steem_datas[0];

        var c = await client.database.getConfig();
        //console.log(c);

        var dgp = await client.database.getDynamicGlobalProperties();
        var t_v_s = dgp.total_vesting_shares.split(' ')[0];
        var t_v_f = dgp.total_vesting_fund_steem.split(' ')[0];
        //console.log(dgp);

        //console.log(account_steem_data);
        var l_v_t = account_steem_data.last_vote_time;
        var v_p = account_steem_data.voting_power;
        var v_s = account_steem_data.vesting_shares.split(' ')[0];
        var d_v_s = account_steem_data.delegated_vesting_shares.split(' ')[0];
        var r_v_s = account_steem_data.received_vesting_shares.split(' ')[0];

        //var secondsago = (new Date - new Date(account_steem_data[0].last_vote_time + "Z")) / 1000;
        var s_a = (new Date() - new Date(l_v_t + 'Z')) / 1000;

        //var current voting_power = account_steem_data[0].voting_power + (10000 * secondsago / 432000);
        var current_voting_power = await Promise.resolve(
            calc_voting_power(account_steem_data)
        );
        $('#voting_power').text(current_voting_power);

        //var steemPower = totalVestingFundSteem * (vestingShares / totalVestingShares);
        var steem_power = (t_v_f * (v_s / t_v_s)).toFixed(2).toLocaleString();
        //console.log(steem_power);

        $('#steem_power').text(Number(steem_power));

        //vesting shares for delegation is => received_vesting_shares.split(' ')[0] - delegated_vesting_shares.split(' ')[0])
        var delegated_steem_power = (
            t_v_f *
            ((r_v_s - d_v_s) / t_v_s)
        ).toLocaleString();
        //console.log(delegated_steem_power);

        $('#delegated_sp').text(
            Number(delegated_steem_power)
                .toFixed(2)
                .toLocaleString()
        );

        //calculate full vote(weight at 10000) worth
        var fund = await client.database.call('get_reward_fund', ['post']);
        var recent_claims = fund.recent_claims;
        var reward_balance = fund.reward_balance.split(' ')[0];

        var price = await client.database.getCurrentMedianHistoryPrice();
        var sbd_median_price = price.base.amount;
        var total_vests =
            Number(account_steem_data.vesting_shares.split(' ')[0]) +
            Number(account_steem_data.received_vesting_shares.split(' ')[0]) -
            Number(account_steem_data.delegated_vesting_shares.split(' ')[0]);
        var final_vest = total_vests * 1e6;
        var power = (account_steem_data.voting_power * 10000) / 10000 / 50;
        var rshares = (power * final_vest) / 10000;
        var estimate =
            (rshares / recent_claims) * reward_balance * sbd_median_price;

        $('#vote_worth').text(
            '$' + Number(estimate.toFixed(2)).toLocaleString()
        );

        var results = await Promise.resolve(
            $.get('/api/private/office/dashboard')
        );

        if (!results) {
            pqy_notify.warn(
                'Sorry, err getting dashboard data. please try again'
            );
            return;
        } else {
            //console.log(results)

            //bot rate
            $('#community_rate').text(results.setting.curation_community_rate);
            $('#team_rate').text(results.setting.curation_team_rate);
            $('#project_rate').text(results.setting.curation_project_rate);

            //curation
            $('#curation_target').text(results.setting.curation_daily_limit);
            $('#curation_total').text(results.reports_count);
            $('#curation_complete').text(results.curated_count);

            //stat
            $('#projects_total').text(results.stat.project_count);
            $('#reports_total').text(results.stat.report_count);
            $('#queries_total').text(results.stat.query_count);

            //community
            $('#users_total').text(results.stat.peer_count);
            $('#earnings_total').text(results.stat.curation_worth);
        }

        $('#main_segment').removeClass('loading');
    } catch (err) {
        window.pqy_notify.warn('Sorry, error getting stats');
        console.log(err);
    }
}

calc();
