'use strict';

var config = require('../../configs/config'),
    activity = require('../../models/activity'),
    team = require('../../models/team'),
    settings = require('../../models/settings');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.post('/api/private/office/settings/update', async function(req, res) {
        try {
            //verify that user has right to edit settings: owner, super_admin or admin
            var user_right = await team
                .findOne({ account: req.active_user.account })
                .select('role _id');

            if (
                !user_right.role == 'owner' &&
                user_right.role !== 'super_admin' &&
                user_right.role !== 'admin'
            ) {
                res.status(405).send('sorry, you have no such rights');
            } else {
                var level = [
                    'curation_rest_day1',
                    'curation_rest_day2',
                    'curation_vote_interval_minutes',
                    'curation_daily_limit',
                    'curation_bot_account',
                ].indexOf(req.body.setting);
                var right = ['owner', 'super_admin'].indexOf(user_right.role);

                if (level && right == -1) {
                    res.status(405).send('sorry, you have no such rights');
                    return;
                } else {
                    var update = {};
                    update[req.body.setting] = req.body.data;

                    await settings.updateOne({ identifier: 'default' }, update);

                    //update site activity
                    var newActivity = activity({
                        title: 'Site settings updated!',
                        slug_id: '/',
                        action: 'update',
                        type: req.body.setting,
                        source: 'settings',
                        account: req.active_user.account,
                        description:
                            '@' +
                            req.active_user.account +
                            ' just updated: ' +
                            req.body.setting +
                            ' to: ' +
                            req.body.data,
                        created: Date.now(),
                    });

                    await newActivity.save();

                    res.status(200).send('sucessfully added team');
                }
            }
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });

    app.post('/api/private/office/settings/reset', async function(req, res) {
        try {
            //verify that user has right to edit settings: owner, super_admin or admin
            var user_right = await team
                .findOne({ account: req.active_user.account })
                .select('role _id');

            if (
                !user_right.role == 'owner' &&
                user_right.role !== 'super_admin'
            ) {
                res.status(405).send('sorry, you have no such rights');
            } else {
                var update = {
                    curation_curator_rate: config.curation_curator_rate,
                    curation_project_rate: config.curation_project_rate,
                    curation_team_rate: config.curation_team_rate,
                    curation_community_rate: config.curation_community_rate,

                    curation_daily_limit: config.curation_daily_limit,
                    curation_rest_day1: config.curation_rest_day1,
                    curation_rest_day2: config.curation_rest_day2,
                    curation_vote_interval_minutes:
                        config.curation_vote_interval_minutes,
                    curation_common_comment: config.curation_common_comment,
                    curation_bot_account: config.curation_bot_account,
                };

                await settings.updateOne(
                    { identifier: 'default' },
                    { $set: update }
                );

                //update site activity
                var newActivity = activity({
                    title: 'Site settings reset!',
                    slug_id: '/',
                    action: 'reset',
                    type: req.body.settings,
                    source: 'settings',
                    account: req.active_user.account,
                    description:
                        '@' +
                        req.active_user.account +
                        ' just reset tje site settings to their default',
                    created: Date.now(),
                });

                await newActivity.save();

                res.status(200).send('sucessfully added team');
            }
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });
};
