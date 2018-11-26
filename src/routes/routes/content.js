'use strict';

var router = require('../../server/router'),
    peers = require('../../models/peer'),
    reports = require('../../models/report'),
    queries = require('../../models/query'),
    projects = require('../../models/project'),
    blog = require('../../models/blog'),
    address = require('../indexes/address'),
    accounter = require('../../lib/helpers/account');

module.exports = function(app) {
    app.get('/', function(req, res) {
        return router(address.content.index, req, res);
    });

    app.get('/steem', function(req, res) {
        return router(address.content.steem, req, res);
    });

    app.get('/@:username', function(req, res) {
        res.redirect('/peer/' + req.params.username);
    });

    app.get('/peer/:username', async function(req, res) {
        try {
            var find = { account: req.params.username };
            var peer = await peers
                .findOneAndUpdate(
                    find,
                    { $inc: { view_count: 1 } },
                    { new: true }
                )
                .select(
                    'account project_count report_count query_count following_count followers_count created location about first_name last_name ' +
                        ' facebook twitter linkedin position company email industry website interest skill view_count curation_point -_id'
                );

            if (!peer) {
                var _peer = {};
                _peer.account = req.params.username;
                _peer.created = new Date();
            }

            res.req_data = peer || _peer;

            return router(address.content.peer, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._404, req, res);
        }
    });

    app.get('/peer/:username/projects', async function(req, res) {
        try {
            var find = { account: req.params.username };
            var peer = await peers
                .findOneAndUpdate(
                    find,
                    { $inc: { view_count: 1 } },
                    { new: true }
                )
                .select('account project_count -_id');
            res.req_data = peer;

            return router(address.content.peer_projects, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._404, req, res);
        }
    });

    app.get('/peer/:username/reports', async function(req, res) {
        try {
            var find = { account: req.params.username };
            var peer = await peers
                .findOneAndUpdate(
                    find,
                    { $inc: { view_count: 1 } },
                    { new: true }
                )
                .select('account report_count -_id');
            res.req_data = peer;

            return router(address.content.peer_reports, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._404, req, res);
        }
    });

    app.get('/peer/:username/queries', async function(req, res) {
        try {
            var find = { account: req.params.username };
            var peer = await peers
                .findOneAndUpdate(
                    find,
                    { $inc: { view_count: 1 } },
                    { new: true }
                )
                .select('account query_count -_id');
            res.req_data = peer;

            return router(address.content.peer_queries, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._404, req, res);
        }
    });

    app.get('/query/:query', async function(req, res) {
        try {
            var query = '';
            //var results = await query.findOne({'permlink': req.params.query}).select(query);
            var results = await queries.findOneAndUpdate(
                { permlink: req.params.query },
                { $inc: { view_count: 1 } },
                { new: true }
            );

            res.req_data = results;
            return router(address.content.query, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._404, req, res);
        }
    });

    app.get('/projects', function(req, res) {
        return router(address.content.projects, req, res);
    });

    app.get('/queries', function(req, res) {
        return router(address.content.queries, req, res);
    });

    app.get('/project/:project', async function(req, res) {
        try {
            var query =
                'name logo cover mission founder location website owner slug slug_id story description member_count created state tag type act_msg act_uri color -_id';
            var results = await projects
                .findOneAndUpdate(
                    { slug: req.params.project },
                    { $inc: { view_count: 1 } },
                    { new: true }
                )
                .select(query);

            if (!results || results == '')
                return router(address._static._404, req, res);

            results.path = '/';
            res.req_data = results;
            return router(address.content.project, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._500, req, res);
        }
    });

    app.get('/project/:project/reports', async function(req, res) {
        try {
            var query =
                'name logo cover mission founder location website owner slug slug_id story description member_count created state tag type act_msg act_uri color -_id';
            var results = await projects
                .findOneAndUpdate(
                    { slug: req.params.project },
                    { $inc: { view_count: 1 } },
                    { new: true }
                )
                .select(query);

            if (!results || results == '')
                return router(address._static._403, req, res);

            results.path = '/reports';
            res.req_data = results;
            return router(address.content.project, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._500, req, res);
        }
    });

    app.get('/project/:project/queries', async function(req, res) {
        try {
            var query =
                'name logo cover mission founder location website owner slug slug_id story description member_count created state tag type act_msg act_uri color -_id';
            var results = await projects
                .findOneAndUpdate(
                    { slug: req.params.project },
                    { $inc: { view_count: 1 } },
                    { new: true }
                )
                .select(query);

            if (!results || results == '')
                return router(address._static._403, req, res);

            results.path = '/queries';
            res.req_data = results;
            return router(address.content.project, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._500, req, res);
        }
    });

    app.get('/project/:project/members', async function(req, res) {
        try {
            var query =
                'name logo cover mission founder location website owner slug slug_id story description member_count created state tag type act_msg act_uri color -_id';
            var results = await projects
                .findOneAndUpdate(
                    { slug: req.params.project },
                    { $inc: { view_count: 1 } },
                    { new: true }
                )
                .select(query);

            if (!results || results == '')
                return router(address._static._403, req, res);

            results.path = '/members';
            res.req_data = results;
            return router(address.content.project, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._500, req, res);
        }
    });

    app.get('/project/:project/requests', async function(req, res) {
        try {
            var query =
                'name logo cover mission founder location website owner slug slug_id story description member_count created state tag type act_msg act_uri color -_id';
            //the below clause makes sure only the project owner can access this route
            var results = await projects
                .findOneAndUpdate(
                    { slug: req.params.project },
                    { $inc: { view_count: 1 } },
                    { new: true }
                )
                .where('owner')
                .equals(req.active_user.account)
                .select(query);

            if (!results || results == '')
                return router(address._static._403, req, res);

            results.path = '/requests';
            res.req_data = results;
            return router(address.content.project, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._500, req, res);
        }
    });

    app.get('/project/:project/messages', async function(req, res) {
        try {
            var query =
                'name logo cover mission founder location website owner slug slug_id story description member_count created state tag type act_msg act_uri color -_id';
            //the below clause makes sure only the project owner can access this route
            var results = await projects
                .findOneAndUpdate(
                    { slug: req.params.project },
                    { $inc: { view_count: 1 } },
                    { new: true }
                )
                .where('owner')
                .equals(req.active_user.account)
                .select(query);

            if (!results || results == '')
                return router(address._static._403, req, res);

            results.path = '/messages';
            res.req_data = results;
            return router(address.content.project, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._500, req, res);
        }
    });

    app.get('/project/:project/stats', async function(req, res) {
        try {
            var query =
                'name logo cover mission founder location website owner slug slug_id story description member_count created state tag type act_msg act_uri color -_id';
            //the below clause makes sure only the project owner can access this route
            var results = await projects
                .findOneAndUpdate(
                    { slug: req.params.project },
                    { $inc: { view_count: 1 } },
                    { new: true }
                )
                .where('owner')
                .equals(req.active_user.account)
                .select(query);

            if (!results || results == '')
                return router(address._static._403, req, res);

            results.path = '/stats';
            res.req_data = results;
            return router(address.content.project, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._500, req, res);
        }
    });

    app.get('/project/:project/manage', async function(req, res) {
        try {
            var query =
                'name logo cover mission founder location website owner slug slug_id story description member_count created state tag type act_msg act_uri color -_id';
            //the below clause makes sure only the project owner can access this route
            var results = await projects
                .findOneAndUpdate(
                    { slug: req.params.project },
                    { $inc: { view_count: 1 } },
                    { new: true }
                )
                .where('owner')
                .equals(req.active_user.account)
                .select(query);

            if (!results || results == '')
                return router(address._static._403, req, res);

            results.path = '/manage';
            res.req_data = results;
            return router(address.content.project, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._500, req, res);
        }
    });

    app.get('/project/:project/edit', async function(req, res) {
        try {
            var query =
                'name logo cover mission founder location website owner slug slug_id story description member_count created state tag type act_msg act_uri color -_id';
            //the below clause makes sure only the project owner can access this route
            var results = await projects
                .findOneAndUpdate(
                    { slug: req.params.project },
                    { $inc: { view_count: 1 } },
                    { new: true }
                )
                .where('owner')
                .equals(req.active_user.account)
                .select(query);

            if (!results || results == '')
                return router(address._static._403, req, res);

            results.path = '/edit';
            res.req_data = results;
            return router(address.content.project, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._500, req, res);
        }
    });

    app.get('/project/:project/settings', async function(req, res) {
        try {
            var query =
                'name logo cover mission founder location website owner slug slug_id story description member_count created state tag type act_msg act_uri color -_id';
            //the below clause makes sure only the project owner can access this route
            var results = await projects
                .findOneAndUpdate(
                    { slug: req.params.project },
                    { $inc: { view_count: 1 } },
                    { new: true }
                )
                .where('owner')
                .equals(req.active_user.account)
                .select(query);

            if (!results || results == '')
                return router(address._static._403, req, res);

            results.path = '/settings';
            res.req_data = results;
            return router(address.content.project, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._500, req, res);
        }
    });

    app.get('/search*', async function(req, res) {
        return router(address.content.search, req, res);
    });

    app.get('/blog', async function(req, res) {
        return router(address.content.blog, req, res);
    });

    app.get('/blog/:permLink', async function(req, res) {
        var find = { permlink: req.params.report };
        var report = await blog
            .findOneAndUpdate(find, { $inc: { view_count: 1 } })
            .select(
                'title summary author view_count project_slug_id project_title -_id'
            );
        res.req_data = report;

        return router(address.content.report, req, res);
    });

    app.get('/reports', function(req, res) {
        return router(address.content.reports, req, res);
    });

    app.get('/peers', function(req, res) {
        return router(address.content.peers, req, res);
    });

    app.get('/peer/:username/wallet', async function(req, res) {
        var find = { account: req.params.username };
        var user = await peers
            .findOneAndUpdate(find, { $inc: { view_count: 1 } })
            .select('account -_id');
        res.req_data = user;

        return router(address.content.wallet, req, res);
    });

    app.get('/report/:report', async function(req, res) {
        var find = { permlink: req.params.report };
        var report = await reports
            .findOneAndUpdate(find, { $inc: { view_count: 1 } })
            .select(
                'title summary author view_count project_slug_id project_title -_id'
            );
        res.req_data = report;

        return router(address.content.report, req, res);
    });

    app.get('/@:username/:permLink', async function(req, res) {
        res.redirect(
            '/report/' +
                accounter.build(req.params.username) +
                '-' +
                req.params.permLink
        );
    });

    app.get('/:category/@:username/:permLink', function(req, res) {
        res.redirect(
            '/report/' +
                accounter.build(req.params.username) +
                '-' +
                req.params.permLink
        );
    });
};
