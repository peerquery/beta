'use strict';

var dsteem = require('dsteem'),
    create_witness = require('./../../../src/lib/creators/witness'),
    create_app = require('./../../../src/lib/creators/app'),
    calc_voting_power = require('./../../../src/lib/helpers/voting-power'),
    calc_reputation = require('./../../../src/lib/helpers/reputation'),
    config = require('./../../../src/configs/config'),
    client = new dsteem.Client(config.steem_api);

const pathname = window.location.pathname;
const account = pathname.split('/peer/')[1].split('/')[0];

(async function() {
    document.getElementById('profile_btn').href = '/peer/' + account;
    document.getElementById('queries_btn').href =
        '/peer/' + account + '/queries';
    document.getElementById('reports_btn').href =
        '/peer/' + account + '/reports';
    document.getElementById('projects_btn').href =
        '/peer/' + account + '/projects';
    document.getElementById('community_btn').href =
        '/peer/' + account + '/community';

    document.getElementById('user_account').innerText = account.toUpperCase();
    document.getElementById('user_account').href = '/peer/' + account;
    document.getElementById('account_img').src =
        'https://steemitimages.com/u/' + account + '/avatar';
    document.getElementById('account_img').onerror = function() {
        this.src = '/assets/images/placeholder.png';
        this.onerror = '';
    };

    document.getElementById('spinner').style.display = 'none';

    const account_steem_datas = await client.database.getAccounts([account]);

    const account_steem_data = account_steem_datas[0];

    document.getElementById('spinner2').style.display = 'none';
    document.getElementById('wealth-div').style.display = 'block';
    document.getElementById('content-loader').style.display = 'none';
    document.getElementById('other').style.visibility = 'visible';

    document.getElementById('content-area').style.display = 'block';

    document.getElementById('steem').innerText = account_steem_data.balance;
    document.getElementById('sbd').innerText = account_steem_data.sbd_balance;

    document.getElementById('created').innerText = new Date(
        account_steem_data.created
    ).toDateString();
    document.getElementById('mined').innerText = account_steem_data.mined;
    document.getElementById('challenged').innerText =
        account_steem_data.owner_challenged;
    document.getElementById('powerdown').innerText = new Date(
        account_steem_data.next_vesting_withdrawal
    ).toDateString();
    document.getElementById('recovery').innerText =
        account_steem_data.recovery_account;
    document.getElementById('reputation').innerText = calc_reputation(
        account_steem_data.reputation
    );
    document.getElementById('lastpost').innerText = new Date(
        account_steem_data.last_post
    ).toDateString();
    document.getElementById(
        'postcount'
    ).innerText = account_steem_data.post_count.toLocaleString();
    document.getElementById('proxy').innerText = account_steem_data.proxy;

    document.getElementById('o_key').innerText =
        account_steem_data.owner.key_auths['0']['0'];
    document.getElementById('a_key').innerText =
        account_steem_data.active.key_auths['0']['0'];
    document.getElementById('p_key').innerText =
        account_steem_data.posting.key_auths['0']['0'];
    document.getElementById('m_key').innerText = account_steem_data.memo_key;

    if (account_steem_data.json_metadata) {
        var metaData = JSON.parse(account_steem_data.json_metadata);
        if (metaData.profile) {
            if (metaData.profile.about != undefined || '') {
                document.getElementById('bio').innerText =
                    metaData.profile.about;
                document.getElementById('bio-area').style.display = 'block';
            }
        }
    }

    document.getElementById('vp_progress').dataset.value = Number(
        calc_voting_power(account_steem_data)
    ).toLocaleString();
    ready();

    for (let x in account_steem_data.witness_votes) {
        let witness = create_witness(account_steem_data.witness_votes[x]);
        $('#witness-container').append(witness);
    }

    var p_apps = account_steem_data.posting.account_auths;
    var pApps = p_apps.map(function(p_apps) {
        return p_apps[0];
    });
    for (let x in pApps) {
        let app = create_app(
            pApps[x],
            ' POSTING',
            'ui teal left pointing label',
            account
        );
        $('#app-container').append(app);
    }

    var a_apps = account_steem_data.active.account_auths;
    var aApps = a_apps.map(function(a_apps) {
        return a_apps[0];
    });
    for (let x in aApps) {
        let app = create_app(
            aApps[x],
            ' ACTIVE',
            'ui red orange pointing label'
        );
        $('#app-container').append(app);
    }

    var o_apps = account_steem_data.owner.account_auths;
    var oApps = o_apps.map(function(o_apps) {
        return o_apps[0];
    });
    for (let x in oApps) {
        let app = create_app(oApps[x], ' OWNER', 'ui red left pointing label');
        $('#app-container').append(app);
    }

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

    $('#delegated').text(
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

    $('#vote').text('$' + Number(estimate.toFixed(2)).toLocaleString());
})();
