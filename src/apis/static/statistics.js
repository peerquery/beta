'use strict';

var team = require('../../models/team'),
    stats = require('../../models/stats');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.get('/api/static/statistics', async function(req, res) {
        try {
            //count the total team members
            var team_count = await team.collection
                .find({ state: { $ne: 'inactive' } })
                .count();

            //load data from stats

            var stat = await stats
                .findOne({ identifier: 'default' })
                .select(
                    ' peer_count project_count report_count query_count request_count ' +
                        ' team_count sponsors_count ' +
                        ' curator_count curation_count curation_worth bot_vote_count -_id'
                );

            res.status(200).json({ stat, team_count });
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });
};
