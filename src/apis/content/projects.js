'use strict';

const projects = require('../../models/project'),
    reports = require('../../models/report'),
    queries = require('../../models/query'),
    peers = require('../../models/peer'),
    membership = require('../../models/membership');

module.exports = async function(app) {
    app.get('/api/fetch/projects/featured/:last_id', async function(req, res) {
        try {
            if (req.params.last_id == 0) {
                let query =
                    'name owner slug description logo location report_count member_count created state type color';
                let options = {
                    steem: { $nin: [null, ''] },
                    website: { $nin: [null, ''] },
                    facebook: { $nin: [null, ''] },
                };
                let results = await projects
                    .find(options)
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                let query =
                    'name owner slug description logo location report_count member_count created state type color';
                let options = {
                    steem: { $nin: [null, ''] },
                    website: { $nin: [null, ''] },
                    facebook: { $nin: [null, ''] },
                    _id: { $gt: req.params.last_id },
                };
                let results = await projects
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

    app.get('/api/fetch/projects/active/:last_id', async function(req, res) {
        try {
            if (req.params.last_id == 0) {
                let query =
                    'name owner slug description logo location report_count member_count created state type color';
                let results = await projects
                    .find({ state: 'active' })
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                let query =
                    'name owner slug description logo location report_count member_count created state type color';
                let results = await projects
                    .find({ state: 'active', _id: { $gt: req.params.last_id } })
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

    app.get('/api/fetch/projects/hibernation/:last_id', async function(
        req,
        res
    ) {
        try {
            if (req.params.last_id == 0) {
                let query =
                    'name owner slug description logo location report_count member_count created state type color';
                let results = await projects
                    .find({ state: 'hibernation' })
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                let query =
                    'name owner slug description logo location report_count member_count created state type color';
                let results = await projects
                    .find({
                        state: 'hibernation',
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

    app.get('/api/fetch/projects/created/:last_id', async function(req, res) {
        try {
            if (req.params.last_id == 0) {
                let query =
                    'name owner slug description logo location report_count member_count created state type color';
                let results = await projects
                    .find()
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                let query =
                    'name owner slug description logo location report_count member_count created state type color';
                let results = await projects
                    .find({ _id: { $gt: req.params.last_id } })
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

    app.get('/api/fetch/projects/random/:last_id', async function(req, res) {
        try {
            let query =
                'name owner slug description logo location report_count member_count created state type color';
            let results = await projects.aggregate([{ $sample: { size: 20 } }]);
            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    //reports by project
    app.get('/api/reports/project/:project_slug_id/:last_id', async function(
        req,
        res
    ) {
        try {
            let find = { project_slug_id: req.params.project_slug_id };

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
                    project_slug_id: req.params.project_slug_id,
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

    //featured reports by project for report page sidebar
    app.get(
        '/api/featured_reports/project/:project_slug_id/:permlink',
        async function(req, res) {
            try {
                let find = {
                    project_slug_id: req.params.project_slug_id,
                    permlink: { $ne: req.params.permlink },
                };

                let query = 'author created title category permlink';

                let results = await reports
                    .find(find)
                    .select(query)
                    .limit(4)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        }
    );

    //queries by project
    app.get('/api/queries/project/:project_slug_id/:last_id', async function(
        req,
        res
    ) {
        try {
            let find = { project_slug_id: req.params.project_slug_id };

            let query =
                'image title description author permlink reward type reward_form project_title project_slug_id deadline created';
            if (req.params.last_id == 0) {
                let results = await queries
                    .find(find)
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                find = {
                    project_slug_id: req.params.project_slug_id,
                    _id: { $gt: req.params.last_id },
                };
                let results = await queries
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

    //requests of project
    app.get('/api/project/:project_slug_id/requests', async function(req, res) {
        try {
            let query = 'account created -_id';

            let options = {
                slug_id: req.params.project_slug_id,
                state: 'pending',
            };

            let results = await membership.find(options).select(query);

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    //team of project
    app.get('/api/project/:project_slug_id/team', async function(req, res) {
        try {
            let query = 'account created role -_id';

            let options = {
                slug_id: req.params.project_slug_id,
                type: 'team',
            };

            let results = await membership.find(options).select(query);

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    //members of project
    app.get('/api/project/:project_slug_id/members', async function(req, res) {
        try {
            let query = 'account created -_id';

            let options = {
                slug_id: req.params.project_slug_id,
                type: 'member',
            };

            let results = await membership.find(options).select(query);

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    //stats of project
    app.get('/api/project/:project_slug_id/stats', async function(req, res) {
        try {
            let find = { slug_id: req.params.project_slug_id };

            let overview = await projects
                .findOne(find, {
                    report_count: 1,
                    query_count: 1,
                    member_count: 1,
                    pending_count: 1,
                    team_count: 1,
                })
                .limit(50)
                .sort({ created: 1 });

            res.status(200).json({ overview });
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    //test to see if user is a members of project
    app.get('/api/project/:project_slug_id/membership', async function(
        req,
        res
    ) {
        try {
            let query = 'role type state created _id';

            let options = {
                identifier:
                    req.active_user.account + '_' + req.params.project_slug_id,
            };

            let results = await membership.findOne(options).select(query);

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/project/:slug/home', async function(req, res) {
        try {
            let query = 'story -_id';
            let results = await projects
                .find({ slug: req.params.slug })
                .select(query);
            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/private/project/:slug/edit', async function(req, res) {
        try {
            let query =
                ' -created -followers -following -founder -last_update -member_count -team -reports -members -owner -report_count -slug -sponsors -verified -_id';

            //the below clause makes sure only the project owner can access this api
            let results = await projects
                .find({ slug: req.params.slug })
                .where('owner')
                .equals(req.active_user.account)
                .select(query);

            if (!results || results == '')
                return res
                    .status(403)
                    .send('Sorry, you have no right to access this route');

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/private/projects/team/list', async function(req, res) {
        try {
            let query = 'name title slug_id -_id';

            let options = {
                account: req.active_user.account,
                type: 'team',
            };

            let results = await membership.find(options).select(query);

            if (!results)
                return res.status(403).send('Sorry, you have no projects');

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
    //featured, viewed, voted, comment, created
};
