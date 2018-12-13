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

//welcomers
config.new_user_message_title = 'Hi there!';
config.new_user_message_body =
    'Welcome to the world of peer to peer collaborations on the Blockchain!. Visit our <a href="/support"> Support Center </a> to get started.';

//default project welcomers
config.new_member_message_title = 'You are our newest member!';
config.new_member_message_body =
    'We are happy to have you as part of our members. Explore our reports to see what we are actively working on.';

//thankers
config.new_benefactor_message_title = 'Many thanks for your support';
config.new_benefactor_message_body =
    'We will continue to work hard to bring our vision closer torwards realization. Reach us by sending us a message on our page.';

//informations
config.new_project_message_title = 'Wow, that is great!';
(config.new_project_message_body =
    'You might want to create an introductory post to introduce your project to the community. Remember to share your project with your friend so as to get them to join!'),
//sc2
(config.sc2_app_name = 'peerquery.app');
config.sc2_scope = 'vote,comment,comment_options,custom_json';
config.sc2_scope_array =
    '[\'vote\', \'comment\', \'comment_options\', \'custom_json\']';

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
