'use strict';

const peers = require('../../models/peer'),
    projects = require('../../models/project'),
    reports = require('../../models/report'),
    queries = require('../../models/query'),
    membership = require('../../models/membership'),
    relation = require('../../models/relation');

module.exports = async function(app) {
    app.post('/api/private/user/update', async function(req, res) {
        try {
            let input = req.body;
            let data = {};

            if (input.first_name) data.first_name = input.first_name;
            if (input.last_name) data.last_name = input.last_name;
            if (input.about) data.about = input.about;
            if (input.skill) data.skill = input.skill;
            if (input.interest) data.interest = input.interest;
            if (input.location) data.location = input.location;
            if (input.website) data.website = input.website;

            if (input.position) data.position = input.position;
            if (input.company) data.company = input.company;
            if (input.industry) data.industry = input.industry;
            if (input.email) data.email = input.email;

            if (input.facebook) data.facebook = input.facebook;
            if (input.twitter) data.twitter = input.twitter;
            if (input.linkedin) data.linkedin = input.linkedin;

            let results = await peers.updateOne(
                { account: req.active_user.account },
                { $set: data },
                { upsert: true }
            );

            res.status(200).send('Profile update successfull');
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/peer/projects/:username/:last_id', async function(req, res) {
        try {
            let query =
                'name owner slug description logo location report_count member_count created state type color';
            let options;

            if (req.params.last_id == 0) {
                options = {
                    owner: { $eq: req.params.username },
                };
            } else {
                options = {
                    owner: { $eq: req.params.username },
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await projects
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

    app.get('/api/peer/reports/:username/:last_id', async function(req, res) {
        try {
            let query = 'author permlink id';
            let find;

            if (req.params.last_id == 0) {
                find = {
                    author: req.params.username,
                };
            } else {
                find = {
                    author: req.params.username,
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await reports
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

    app.get('/api/peer/queries/:username/:last_id', async function(req, res) {
        try {
            let query =
                'image title description author permlink reward type reward_form project_title project_slug_id deadline created';
            let find;

            if (req.params.last_id == 0) {
                find = {
                    author: req.params.username,
                };
            } else {
                find = {
                    author: req.params.username,
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await queries
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

    app.get('/api/fetch/peers/featured/:last_id', async function(req, res) {
        try {
            let query =
                'account about last_project_slug_id last_project_title badge position company skill';
            let find;

            if (req.params.last_id == 0) {
                find = {
                    project_count: { $gt: 0 },
                    curation_points: { $gt: 0 },
                };
            } else {
                find = {
                    project_count: { $gt: 0 },
                    curation_points: { $gt: 0 },
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await peers
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

    app.get('/api/fetch/peers/interesting/:last_id', async function(req, res) {
        try {
            let query =
                'account about last_project_slug_id last_project_title badge position company skill';
            let find;

            if (req.params.last_id == 0) {
                find = {
                    curation_points: { $gt: 0 },
                };
            } else {
                find = {
                    curation_points: { $gt: 0 },
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await peers
                .find(find)
                .select(query)
                .limit(20)
                .sort({ report_count: -1 });

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/fetch/peers/fresh/:last_id', async function(req, res) {
        try {
            let query =
                'account about last_project_slug_id last_project_title badge position company skill';
            let find;

            if (req.params.last_id == 0) {
                find = {};
            } else {
                find = {
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await peers
                .find(find)
                .select(query)
                .limit(20)
                .sort({ _id: -1 });

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/private/beneficiaries/list', async function(req, res) {
        try {
            let membership_query = 'steem benefactor_rate -_id';

            let membership_options = {
                account: req.active_user.account,
                benefactor_rate: { $gt: 0 },
            };

            let membership_results = await membership
                .find(membership_options)
                .select(membership_query);

            let relation_query = 'following benefactor_rate -_id';

            let relation_options = {
                follower: req.active_user.account,
                benefactor_rate: { $gt: 0 },
            };

            let relation_results = await relation
                .find(relation_options)
                .select(relation_query);

            if (!membership_results || !relation_results)
                return res.status(404).send('Sorry, you have no beneficiaries');

            let results = {
                membership: relation_results,
                relation: membership_results,
            };

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
};
