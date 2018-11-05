'use strict';

var projects = require('../models/project'),
    reports = require('../models/report'),
    queries = require('../models/query'),
    users = require('../models/peer');

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

    app.get('/api/fetch/users/builders/:last_id', async function(req, res) {
        try {
            if (req.params.last_id == 0) {
                let query =
                    'account about last_project_slug_id last_project_title badge created state';
                let results = await users
                    .find({ project_count: { $gt: 0 } })
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                let query =
                    'account about last_project_slug_id last_project_title badge created state';
                let results = await users
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

    app.get('/api/fetch/users/reporters/:last_id', async function(req, res) {
        try {
            if (req.params.last_id == 0) {
                let query =
                    'account about last_project_slug_id last_project_title badge created state';
                let results = await users
                    .find({ project_count: 0, report_count: { $gt: 0 } })
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                let query =
                    'account about last_project_slug_id last_project_title badge created state';
                let results = await users
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

    app.get('/api/fetch/users/observers/:last_id', async function(req, res) {
        try {
            if (req.params.last_id == 0) {
                let query =
                    'account about last_project_slug_id last_project_title badge created state';
                let results = await users
                    .find({ project_count: 0, report_count: 0 })
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
                res.status(200).json(results);
            } else {
                let query =
                    'account about last_project_slug_id last_project_title badge created state';
                let results = await users
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

            if (!results || results == '') return;
            res.status(403).send(
                'Sorry, you have no right to access this route'
            );

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/private/projects/list', async function(req, res) {
        try {
            let query = 'name title slug -_id';

            //the below clause makes sure only the project owner can access this api
            let results = await users.aggregate([
                { $match: { account: req.active_user.account } },
                {
                    $project: {
                        memberships: {
                            $filter: {
                                input: '$memberships',
                                as: 'membership',
                                cond: { $eq: ['$$membership.type', 'team'] },
                            },
                        },
                    },
                },
            ]);

            results = results[0].memberships;

            if (!results)
                return res.status(403).send('Sorry, you have no projects');

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
    //featured, viewed, voted, comment, created

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
            let find = { slug_id: req.params.project_slug_id };

            let results = await projects.aggregate([
                { $match: { slug_id: req.params.project_slug_id } },
                {
                    $project: {
                        requests: {
                            $filter: {
                                input: '$members',
                                as: 'requests',
                                cond: { $eq: ['$$requests.state', 'pending'] },
                            },
                        },
                    },
                },
            ]);
            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    //team of project
    app.get('/api/project/:project_slug_id/team', async function(req, res) {
        try {
            let find = { slug_id: req.params.project_slug_id };

            let results = await projects.aggregate([
                { $match: { slug_id: req.params.project_slug_id } },
                {
                    $project: {
                        team: {
                            $filter: {
                                input: '$members',
                                as: 'team',
                                cond: { $eq: ['$$team.type', 'team'] },
                            },
                        },
                    },
                },
            ]);
            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    //members of project
    app.get('/api/project/:project_slug_id/members', async function(req, res) {
        try {
            let find = { slug_id: req.params.project_slug_id };

            let results = await projects.aggregate([
                { $match: { slug_id: req.params.project_slug_id } },
                {
                    $project: {
                        members: {
                            $filter: {
                                input: '$members',
                                as: 'members',
                                cond: { $eq: ['$$members.type', 'member'] },
                            },
                        },
                    },
                },
            ]);
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
                })
                .limit(50)
                .sort({ created: 1 });

            let team = await projects.aggregate([
                { $match: { slug_id: req.params.project_slug_id } },
                {
                    $project: {
                        team_count: {
                            $filter: {
                                input: '$members',
                                as: 'team_count',
                                cond: { $eq: ['$$team_count.type', 'team'] },
                            },
                        },
                    },
                },
                { $unwind: '$team_count' },
                { $group: { _id: null, team_count: { $sum: 1 } } },
            ]);

            let pending = await projects.aggregate([
                { $match: { slug_id: req.params.project_slug_id } },
                {
                    $project: {
                        pending_count: {
                            $filter: {
                                input: '$members',
                                as: 'pending_count',
                                cond: {
                                    $eq: ['$$pending_count.state', 'pending'],
                                },
                            },
                        },
                    },
                },
                { $unwind: '$pending_count' },
                { $group: { _id: null, pending_count: { $sum: 1 } } },
            ]);

            res.status(200).json({ overview, team, pending });
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
            let find = { slug_id: req.params.project_slug_id };

            let results = await projects.findOne(find, {
                members: { $elemMatch: { account: req.active_user.account } },
            });
            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    /*
    //members of project
    app.get('/api/project/:project_slug_id/members', async function(req, res) {
        try {
            let find = { slug_id: req.params.project_slug_id };

            let results = await projects
                .findOne(find, { members: 1 })
                .limit(50)
                .sort({ created: 1 });
            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
    */
};
