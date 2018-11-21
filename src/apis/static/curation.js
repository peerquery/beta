'use strict';

var report = require('../../models/report');

module.exports = async function(app) {
    app.get('/api/curation/reports/featured/:last_id', async function(
        req,
        res
    ) {
        try {
            let query = 'author permlink';
            let find;

            if (req.params.last_id == 0) {
                find = {
                    curation_state: { $gte: 2 },
                    project_slug_id: { $gt: '' },
                };
            } else {
                find = {
                    curation_state: { $gte: 2 },
                    project_slug_id: { $gt: '' },
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await report
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

    app.get('/api/curation/reports/interesting/:last_id', async function(
        req,
        res
    ) {
        try {
            let query = 'author permlink';
            let find;

            if (req.params.last_id == 0) {
                find = {
                    curation_state: { $eq: null },
                    project_slug_id: { $gt: '' },
                };
            } else {
                find = {
                    curation_state: { $eq: null },
                    project_slug_id: { $gt: '' },
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await report
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

    app.get('/api/curation/reports/voted/:last_id', async function(req, res) {
        try {
            let query = 'author permlink';
            let find;

            if (req.params.last_id == 0) {
                find = { voted: 'true', project_slug_id: { $gt: '' } };
            } else {
                find = {
                    voted: 'true',
                    project_slug_id: { $gt: '' },
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await report
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

    app.get('/api/curation/reports/rejected/:last_id', async function(
        req,
        res
    ) {
        try {
            let query = 'author permlink';
            let find;

            if (req.params.last_id == 0) {
                find = { curation_state: { $eq: -1 } };
            } else {
                find = {
                    curation_state: { $eq: -1 },
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await report
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
