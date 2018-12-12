'use strict';

var hire = require('../../models/hire');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.get('/api/private/hires/:last_id', async function(req, res) {
        try {
            let query = 'title created permlink author';
            let options;

            if (req.params.last_id == 0) {
                options = {
                    recipient: req.active_user.account,
                };
            } else {
                options = {
                    recipient: req.active_user.account,
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await hire
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
