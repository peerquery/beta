'use strict';

var membership = require('../../models/membership');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.get('/api/private/memberships/:last_id', async function(req, res) {
        try {
            let query = 'title created slug_id benefactor_rate role';
            let options;

            if (req.params.last_id == 0) {
                options = {
                    account: req.active_user.account,
                    state: { $nin: ['inactive', 'pending', 'blacklist'] },
                };
            } else {
                options = {
                    account: req.active_user.account,
                    state: { $nin: ['inactive', 'pending', 'blacklist'] },
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await membership
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
