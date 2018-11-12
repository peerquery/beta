'use strict';

var config = require('./config'),
    settings = require('../models/settings'),
    team = require('../models/team');

module.exports = async function(app) {
    try {
        //
        //set the site's basic details
        //

        //static id - to ensure there is always only one 'settings' document
        var settings_query = { identifier: 'default' };

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

            //do not enable this else will set curation settings on every server re-start
            /*
            curation_vote_interval_minutes: config.curation_vote_interval_minutes,
            curation_rest_day1: config.curation_rest_day1,
            curation_rest_day2: config.curation_rest_day2,
            curation_daily_limit: config.curation_daily_limit,
            curation_common_comment: config.curation_common_comment,
            */

            update_update: new Date(),
        };

        var settings_options = { upsert: true };

        var settings_status = await settings.updateOne(
            settings_query,
            updateSettings,
            settings_options
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
