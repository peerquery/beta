'use strict';

var config = require('./config'),
    stats = require('../models/stats'),
    settings = require('../models/settings'),
    team = require('../models/team');

module.exports = async function(app) {
    try {
        //
        //set the site's basic details
        //

        //see if details exists, else set them

        var updateSettings = {
            //static id - to ensure there is always only one 'settings' document
            identifier: 'default',

            //meta
            name: config.site_name,
            description: config.site_description,

            //basic team
            owner: config.steem_account,
            super_admin: config.super_admin,

            //uris
            domain: config.site_uri,
            steem: config.steem_account,

            curation_curator_rate: config.curation_curator_rate,
            curation_team_rate: config.curation_team_rate,
            curation_project_rate: config.curation_project_rate,
            curation_community_rate: config.curation_community_rate,

            curation_bot_account: config.curation_bot_account,
            curation_vote_interval_minutes:
                config.curation_vote_interval_minutes,
            curation_rest_day1: config.curation_rest_day1,
            curation_rest_day2: config.curation_rest_day2,
            curation_daily_limit: config.curation_daily_limit,
            curation_common_comment: config.curation_common_comment,

            site_start_time: new Date(),
        };

        await settings.updateOne(
            { identifier: 'default' }, //static id - to ensure there is always only one 'settings' document
            { $setOnInsert: updateSettings },
            { upsert: true }
        );

        await stats.updateOne(
            { identifier: 'default' }, //static id - to ensure there is always only one 'settings' document
            { $inc: { site_up_count: 1 } },
            { upsert: true }
        );

        //
        //now set the owner
        //

        var team_query1 = { account: 'peerquery' };

        var updateTeam1 = {
            name: config.site_name,
            account: config.steem_account,
            role: 'owner',
        };

        var team_options1 = { upsert: true };

        var team_status1 = await team.updateOne(
            team_query1,
            updateTeam1,
            team_options1
        );

        //
        //now set the admin
        //

        var team_query2 = { account: 'dzivenu' };

        var updateTeam2 = {
            name: '',
            account: config.super_admin,
            role: 'super_admin',
        };

        var team_options2 = { upsert: true };

        var team_status2 = await team.updateOne(
            team_query2,
            updateTeam2,
            team_options2
        );

        console.log('\n\n\nDB setup successful, starting server... ');

        return true;
    } catch (err) {
        console.log(err);
    }
};
