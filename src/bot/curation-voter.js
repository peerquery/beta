'use strict';

const reports = require('../models/report');
const config = require('../configs/config');

module.exports = async function(global_settings) {
    var actions = 'vote_comment';

    //fetch team accounts including *project blog* but excluding *curators* and those *inactive*
    var results = await reports
        .findOneAndUpdate(
            { curation_state: 2 },
            { $inc: { curation_state: 1 } }
        ) // increase curation state at once, so this post will not be fetched twice
        .select(
            'curation_rate curation_curator curation_remarks author permlink -_id'
        ); // by the server's other versions in clusters or other EC2 instances
    // the danger here is that if the voting bot fails, well the post will remain marked as voted

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
        global_settings.curation_common_comment;
    data.json_metadata =
        '{"app": "' +
        config.site_name +
        '", "community":"' +
        config.community +
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
