'use strict';

//this module will be bundle to the client so should contain ONLY NON-SENSITIVE information

var config = {};

//site
config.site_name = 'Peer Query';
config.site_description = 'Peer to Peer collaborations powered by Steem';
config.site_uri = 'http://www.peerquery.com';
config.super_admin = 'dzivenu';

//steem
config.steem_api = 'https://api.steemit.com';
config.steem_rpc = 'https://api.steemit.com';
config.steem_account = 'peerquery';
config.community = 'peerquery';

//sc2
config.sc2_app_name = 'peerquery.app';
config.sc2_scope = 'vote,comment,custom_json';
config.sc2_scope_array = '[\'vote\', \'comment\', \'custom_json\']';

//attribution
config.report_attribution =
    '  \n\n- - -\n\n  Published on [Peer Query - Blockchain-powered p2p collaboration](URL).  \n\n  ';
config.comment_attribution =
    '  \n\n- - -\n\n  Posted on [Peer Query](http://www.peerquery.com).';

//curation
config.curation_bot_account = 'peerquery';
config.curation_curator_rate = 2;
config.curation_project_rate = 20;
config.curation_team_rate = 15;
config.curation_community_rate = 5;

config.curation_daily_limit = 20;
config.curation_rest_day1 = 'saturday';
config.curation_rest_day2 = 'sunday';
config.curation_vote_interval_minutes = 20;
config.curation_common_comment =
    'Nice work! Consider delegating Steem power to support Peer Query in its bit to support peer to peer collaborations.';

module.exports = config;
