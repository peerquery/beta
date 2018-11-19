'use strict';

var dsteem = require('dsteem'),
    config = require('./../../../src/configs/config'),
    calc_voting_power = require('./../../../src/lib/helpers/voting-power'),
    num2str = require('./../../../src/lib/helpers/num2str'),
    client = new dsteem.Client(config.steem_api);

async function calc() {
    try {
        var results = await Promise.resolve($.get('/api/static/statistics'));

        if (!results) {
            pqy_notify.warn(
                'Sorry, err getting statistical data. please try again'
            );
        } else {
            //usage
            $('#query_count').text(results.stat.peer_count);
            $('#project_count').html(
                num2str.process(results.stat.project_count)
            );
            $('#report_count').text(results.stat.report_count);

            //community
            $('#peer_count').html(
                num2str.process(results.stat.peer_count) || '0'
            );
            $('#team_count').text(results.team_count || '0');
            $('#sponsor_count').text(results.stat.sponsors_count || '0');

            //curation
            $('#curation_count').text(results.stat.curation_count || '0');
            $('#curation_worth').text(results.stat.curation_worth || '0');

            $('#statistics-loader').hide();
            $('#usage_community_segment').show();
        }

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
        //$('#voting_power').text(current_voting_power);

        //var steemPower = totalVestingFundSteem * (vestingShares / totalVestingShares);
        var steem_power = (t_v_f * (v_s / t_v_s)).toFixed().toLocaleString();
        //console.log(steem_power);

        $('#steem_power').html(num2str.process(Number(steem_power)));

        $('#curation_segment').show();

        /*
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
        */
    } catch (err) {
        window.pqy_notify.warn('Sorry, error getting stats');
        console.log(err);
    }
}

calc();
