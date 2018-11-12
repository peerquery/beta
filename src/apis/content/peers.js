'use strict';

var peers = require('../../models/peer');

module.exports = async function(app) {
    app.get('/api/fetch/peers/builders/:last_id', async function(req, res) {
        try {
            if (req.params.last_id == 0) {
                let query =
                    'account about last_project_slug_id last_project_title badge created state';
                let results = await peers
                    .find({ project_count: { $gt: 0 } })
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                let query =
                    'account about last_project_slug_id last_project_title badge created state';
                let results = await peers
                    .find({
                        project_count: { $gt: 0 },
                        _id: { $gt: req.params.last_id },
                    })
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/fetch/peers/reporters/:last_id', async function(req, res) {
        try {
            if (req.params.last_id == 0) {
                let query =
                    'account about last_project_slug_id last_project_title badge created state';
                let results = await peers
                    .find({ project_count: 0, report_count: { $gt: 0 } })
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                let query =
                    'account about last_project_slug_id last_project_title badge created state';
                let results = await peers
                    .find({
                        project_count: 0,
                        report_count: { $gt: 0 },
                        _id: { $gt: req.params.last_id },
                    })
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/fetch/peers/observers/:last_id', async function(req, res) {
        try {
            if (req.params.last_id == 0) {
                let query =
                    'account about last_project_slug_id last_project_title badge created state';
                let results = await peers
                    .find({ project_count: 0, report_count: 0 })
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                let query =
                    'account about last_project_slug_id last_project_title badge created state';
                let results = await peers
                    .find({
                        project_count: 0,
                        report_count: 0,
                        _id: { $gt: req.params.last_id },
                    })
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
};
