'use strict';

var reports = require('../models/report');

const config = require('../configs/config');
const dsteem = require('dsteem');
const client = new dsteem.Client(config.steem_rpc);

module.exports = async function(global_settings) {
    var actions = 'vote_comment';

    //fetch team accounts including *project blog* but excluding *curators* and those *inactive*
    var results = await reports
        .find({ curation_state: 2 })
        .select('author permlink -_id')
        .limit(1);

    if (!results || results == '') return;

    var data = {};
    var approved =
        '<b>Approved for ' +
        results.curation_rate +
        '% by @' +
        results.curation_curator +
        '</b><br/><br/>';

    //set universal variables
    data.author = results.author;
    data.voter = global_settings.curation_bot_account;
    data.user = global_settings.curation_bot_account;
    data.permlink = results.permlink;
    data.weight = results.curation_rate * 100;
    data.body =
        approved +
        '<b>Remarks</b>: <em>' +
        results.curation_remarks +
        '</em><br/><br/>' +
        global_settings.common_comment;
    data.json_metadata =
        '{"app": "' +
        global_settings.site_name +
        '", "community":"' +
        global_settings.community +
        '"}';
    data.parent_author = results.author;
    data.parent_permlink = results.permlink;
    data.new_permlink = Math.random()
        .toString(36)
        .substring(2);

    return {
        data: data,
        actions: actions,
        type: 'curation',
        config: global_settings,
    };
};
