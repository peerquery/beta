'use strict';

var blog = require('../../models/blog');

module.exports = async function(app) {
    app.get('/api/blog/reports/:last_id', async function(req, res) {
        try {
            let query = 'account permlink';

            let find;

            if (req.params.last_id == 0) {
                find = { project_count: { $gt: 0 } };
            } else {
                find = {
                    project_count: { $gt: 0 },
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await blog
                .find(find)
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
