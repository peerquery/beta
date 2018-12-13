'use strict';

var queries = require('../../models/query');
var peer = require('../../models/peer');
var project = require('../../models/project');

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

    app.get('/api/fetch/queries/popular/short', async function(req, res) {
        try {
            let results = await queries
                .find({})
                .select('author title permlink created view_count')
                .sort({ view_count: -1 })
                .limit(10);
            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/fetch/queries/new/short', async function(req, res) {
        try {
            let results = await queries
                .find({})
                .select('author title permlink created view_count')
                .sort({ _id: -1 })
                .limit(10);
            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.post('/api/private/query/delete', async function(req, res) {
        try {
            let results = await queries.findOneAndDelete({
                permlink: req.body.permlink,
                author: req.active_user.account,
            });
            if (!results)
                return res
                    .status(405)
                    .send('Query might not exist or you are not the author');

            if (req.body.project_slug_id)
                await project.updateOne(
                    { slug_id: req.body.project_slug_id },
                    { $inc: { query_count: -1 } }
                );

            await peer.updateOne(
                { account: req.body.author },
                { $inc: { query_count: -1 } }
            );
            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.post('/api/private/query/update', async function(req, res) {
        try {
            let update = {
                title: req.body.title,
                image: req.body.image,
                description: req.body.description,
                body: req.body.body,
                reward_form: req.body.reward_form,
                type: req.body.type,
                label: req.body.label,
                deadline: req.body.deadline,
                telephone: req.body.telephone,
                email: req.body.email,
                website: req.body.website,
            };

            let results = await queries.findOneAndUpdate(
                {
                    permlink: req.body.permlink,
                    author: req.active_user.account,
                },
                update
            );
            if (!results)
                return res
                    .status(405)
                    .send('Query might not exist or you are not the author');

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
};
