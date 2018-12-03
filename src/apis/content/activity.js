'use strict';

var activity = require('../../models/activity');
var peer = require('../../models/peer');

module.exports = async function(app) {
    app.get('/api/peer/activity/:last_id', async function(req, res) {
        try {
            let query = 'account title description action slug_id created';
            let options;

            if (req.params.last_id == 0) {
                options = {
                    account: req.active_user.account,
                };
            } else {
                options = {
                    account: req.active_user.account,
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await activity
                .find(options)
                .select(query)
                .limit(20)
                .sort({ created: -1 });

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
};
