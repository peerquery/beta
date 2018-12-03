'use strict';

var notification = require('../../models/notification');

module.exports = async function(app) {
    app.get('/api/peer/notifications/:last_id', async function(req, res) {
        try {
            let query = 'event from from_name status source created';
            let options;

            if (req.params.last_id == 0) {
                options = {
                    to: req.active_user.account,
                    status: 'pending',
                };
            } else {
                options = {
                    to: req.active_user.account,
                    status: 'pending',
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await notification
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
