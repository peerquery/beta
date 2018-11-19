'use strict';

var reports = require('../../models/report'),
    activity = require('../../models/activity'),
    stats = require('../../models/stats'),
    settings = require('../../models/settings');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.get('/api/private/office/dashboard', async function(req, res) {
        try {
            //load data from settings

            var setting = await settings
                .findOne({ identifier: 'default' })
                .select(
                    ' curation_curator_rate curation_team_rate curation_project_rate curation_community_rate ' +
                        ' curation_bot_account curation_daily_limit curation_vote_interval_minutes ' +
                        ' curation_rest_day1 curation_rest_day2 super_admin owner -_id'
                );

            //load data from stats

            var stat = await stats
                .findOne({ identifier: 'default' })
                .select(
                    ' peer_count project_count report_count query_count request_count ' +
                        ' curator_count curation_count curation_worth bot_vote_count -_id'
                );

            //curated today; rejected, approved and voted
            var curated_count = await reports.collection
                .find({
                    curation_state: { $in: [-1, 2, 3] },
                    created: {
                        $gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    },
                })
                .count();

            //all reports for today, regardless of their curation
            var reports_count = await reports.collection
                .find({
                    created: {
                        $gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    },
                })
                .count();

            res.status(200).json({
                setting,
                stat,
                curated_count,
                reports_count,
            });
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });
};
