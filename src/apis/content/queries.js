'use strict';

var queries = require('../../models/query');

module.exports = async function(app) {
    app.get('/api/fetch/queries/featured/:last_id', async function(req, res) {
        try {
            if (req.params.last_id == 0) {
                let query =
                    'image title description author permlink reward type reward_form project_title project_slug_id deadline created';
                let options = { project_slug_id: { $nin: [null, ''] } };
                let results = await queries
                    .find(options)
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                let query =
                    'name owner slug description logo location report_count member_count created state type color';
                let options = {
                    project_slug_id: { $nin: [null, ''] },
                    _id: { $gt: req.params.last_id },
                };
                let results = await queries
                    .find(options)
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

    app.get('/api/fetch/queries/voted/:last_id', async function(req, res) {
        try {
            if (req.params.last_id == 0) {
                let query =
                    'image title description author permlink reward type reward_form project_title project_slug_id deadline created';
                let results = await queries
                    .find()
                    .select(query)
                    .limit(20)
                    .sort({ vote_count: -1 });
                res.status(200).json(results);
            } else {
                let query =
                    'name owner slug description logo location report_count member_count created state type color';
                let results = await queries
                    .find()
                    .select(query)
                    .limit(20)
                    .sort({ vote_count: -1 });
                res.status(200).json(results);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/fetch/queries/viewed/:last_id', async function(req, res) {
        try {
            if (req.params.last_id == 0) {
                let query =
                    'image title description author permlink reward type reward_form project_title project_slug_id deadline created';
                let results = await queries
                    .find()
                    .select(query)
                    .limit(20)
                    .sort({ view_count: -1 });
                res.status(200).json(results);
            } else {
                let query =
                    'name owner slug description logo location report_count member_count created state type color';
                let results = await queries
                    .find()
                    .select(query)
                    .limit(20)
                    .sort({ view_count: -1 });
                res.status(200).json(results);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/fetch/queries/created/:last_id', async function(req, res) {
        try {
            if (req.params.last_id == 0) {
                let query =
                    'image title description author permlink reward type reward_form project_title project_slug_id deadline created';
                let results = await queries
                    .find()
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                let query =
                    'name owner slug description logo location report_count member_count created state type color';
                let results = await queries
                    .find()
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

    app.get('/api/fetch/queries/random/:last_id', async function(req, res) {
        try {
            let query =
                'image title description author permlink reward type reward_form project_title project_slug_id deadline created';
            let results = await queries.aggregate([{ $sample: { size: 20 } }]);
            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
};
