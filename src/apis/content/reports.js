'use strict';

var reports = require('../../models/report');

module.exports = async function(app) {
    app.get('/api/reports/featured/:last_id', async function(req, res) {
        try {
            var start = new Date(
                new Date().getTime() - 7 * 24 * 60 * 60 * 1000
            ); //seven days ago
            let find = {
                created: { $gte: start },
                project_slug_id: { $nin: [null, ''] },
            };

            let query = 'author permlink id';
            if (req.params.last_id == 0) {
                let results = await reports
                    .find(find)
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                find = {
                    created: { $gte: start },
                    project_slug_id: { $nin: [null, ''] },
                    _id: { $gt: req.params.last_id },
                };
                let results = await reports
                    .find(find)
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

    app.get('/api/reports/created/:last_id', async function(req, res) {
        try {
            var start = new Date(
                new Date().getTime() - 7 * 24 * 60 * 60 * 1000
            ); //seven days ago
            let find = { created: { $gte: start } };

            let query = 'author permlink id';
            if (req.params.last_id == 0) {
                let results = await reports
                    .find(find)
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                find = {
                    created: { $gte: start },
                    _id: { $gt: req.params.last_id },
                };
                let results = await reports
                    .find(find)
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

    app.get('/api/reports/popular/:last_id', async function(req, res) {
        try {
            var start = new Date(
                new Date().getTime() - 7 * 24 * 60 * 60 * 1000
            ); //seven days ago
            let find = { created: { $gte: start } };

            let query = 'author permlink id';
            if (req.params.last_id == 0) {
                let results = await reports
                    .find(find)
                    .select(query)
                    .limit(20)
                    .sort({ view_count: 1 });
                res.status(200).json(results);
            } else {
                find = {
                    created: { $gte: start },
                    _id: { $gt: req.params.last_id },
                };
                let results = await reports
                    .find(find)
                    .select(query)
                    .limit(20)
                    .sort({ view_count: 1 });
                res.status(200).json(results);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/reports/trending/:last_id', async function(req, res) {
        try {
            var start = new Date(
                new Date().getTime() - 7 * 24 * 60 * 60 * 1000
            ); //seven days ago
            let find = { created: { $gte: start } };

            let query = 'author permlink id';
            if (req.params.last_id == 0) {
                let results = await reports
                    .find(find)
                    .select(query)
                    .limit(20)
                    .sort({ vote_count: 1 });
                res.status(200).json(results);
            } else {
                find = {
                    created: { $gte: start },
                    _id: { $gt: req.params.last_id },
                };
                let results = await reports
                    .find(find)
                    .select(query)
                    .limit(20)
                    .sort({ vote_count: 1 });
                res.status(200).json(results);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/reports/discussed/:last_id', async function(req, res) {
        try {
            var start = new Date(
                new Date().getTime() - 7 * 24 * 60 * 60 * 1000
            ); //seven days ago
            let find = { created: { $gte: start } };

            let query = 'author permlink id';
            if (req.params.last_id == 0) {
                let results = await reports
                    .find(find)
                    .select(query)
                    .limit(20)
                    .sort({ comment_count: 1 });
                res.status(200).json(results);
            } else {
                find = {
                    created: { $gte: start },
                    _id: { $gt: req.params.last_id },
                };
                let results = await reports
                    .find(find)
                    .select(query)
                    .limit(20)
                    .sort({ comment_count: 1 });
                res.status(200).json(results);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    //reports by user
    app.get('/api/reports/user/:username/:last_id', async function(req, res) {
        try {
            let find = { author: req.params.username };

            let query = 'author permlink id';
            if (req.params.last_id == 0) {
                let results = await reports
                    .find(find)
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                find = {
                    author: req.params.username,
                    _id: { $gt: req.params.last_id },
                };
                let results = await reports
                    .find(find)
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
