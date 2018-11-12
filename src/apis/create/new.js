'use strict';

var shortid = require('shortid'),
    markup = require('markup-builder'),
    activity = require('../../models/activity'),
    peer = require('../../models/peer'),
    stats = require('../../models/stats'),
    report = require('../../models/report'),
    query = require('../../models/query'),
    project = require('../../models/project');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.post('/api/private/create/report', async function(req, res) {
        try {
            var project_title = req.body.project_title;
            var project_slug_id = req.body.project_slug_id;

            var newReport = report({
                steemid: req.body.steemid,
                author: req.active_user.account,
                title: req.body.title,
                category: req.body.category,
                summary: await markup.build.summary(req.body.body, 300),
                body: req.body.body,
                permlink: req.body.permlink,
                project_title: project_title,
                project_slug_id: project_slug_id,
                url: req.active_user.account + '/' + req.body.permlink,
                view_count: 1,
                curation_state: 0,
                created: new Date(),
                update_at: new Date(),
            });

            var newActivity = activity({
                title: req.body.title,
                slug_id:
                    '/@' + req.active_user.account + '/' + req.body.permlink,
                action: 'create',
                type: 'report',
                source: 'user',
                account: req.active_user.account,
                description:
                    '@' +
                    req.active_user.account +
                    ' just published a new report: ' +
                    req.body.title,
                created: Date.now(),
            });

            var updatePeer = {
                $inc: { report_count: 1 },
                badge: 'reporter',
                last_update: Date.now(),
                last_report: req.body.permlink,
            };

            await newReport.save();
            await newActivity.save();
            await peer.updateOne(
                { account: req.active_user.account },
                updatePeer,
                { upsert: true }
            );

            await stats.updateOne(
                { identifier: 'default' },
                { $inc: { report_count: 1 } }
            );

            if (project_slug_id && project_title) {
                var updateProject = {
                    $inc: { report_count: 1 },
                    last_update: Date.now(),
                };

                var newQuery = {
                    slug_id: project_slug_id,
                    title: project_title,
                    owner: req.active_user.account,
                };
                await project.updateOne(newQuery, updateProject, {
                    upsert: true,
                }); //returns query!?
            }

            res.status(200).send('success');
        } catch (err) {
            res.status(500).send(
                'sorry, could not create project. please try again'
            );
            console.log(err);
        }
    });

    app.post('/api/private/create/query', async function(req, res) {
        try {
            var project_title = req.body.project_title;
            var project_slug_id = req.body.project_slug_id;

            var newQuery = query({
                steemid: req.body.steemid,
                author: req.active_user.account,
                title: req.body.title,
                category: req.body.category,
                summary: await markup.build.summary(req.body.body, 300),
                body: req.body.body,
                permlink: req.body.permlink,
                project_title: project_title,
                project_slug_id: project_slug_id,
                url: req.active_user.account + '/' + req.body.permlink,
                view_count: 1,
                terms: req.body.terms,
                email: req.body.email,
                telephone: req.body.telephone,
                website: req.body.website,
                reward: req.body.reward,
                reward_form: req.body.reward_form,
                label: req.body.label,
                type: req.body.type,
                deadline: req.body.deadline,
                image: req.body.image,
                description: req.body.description,
                created: new Date(),
                update_at: new Date(),
            });

            var newActivity = activity({
                title: req.body.title,
                slug_id:
                    '/@' + req.active_user.account + '/' + req.body.permlink,
                action: 'create',
                type: 'query',
                source: 'user',
                account: req.active_user.account,
                description:
                    '@' +
                    req.active_user.account +
                    ' just published a new query: ' +
                    req.body.title,
                created: Date.now(),
            });

            var updatePeer = {
                $inc: { query_count: 1 },
                badge: 'querant',
                last_update: Date.now(),
                last_report: req.body.permlink,
            };

            await newQuery.save();
            await newActivity.save();
            await peer.updateOne(
                { account: req.active_user.account },
                updatePeer,
                { upsert: true }
            );

            await stats.updateOne(
                { identifier: 'default' },
                { $inc: { query_count: 1 } }
            );
            if (
                project_slug_id !== null &&
                project_slug_id !== undefined &&
                project_title !== null &&
                project_title !== undefined
            ) {
                var updateProject = {
                    $inc: { query_count: 1 },
                    last_update: Date.now(),
                };

                var projectQuery = {
                    slug_id: project_slug_id,
                    title: project_title,
                    owner: req.active_user.account,
                };
                await project.updateOne(projectQuery, updateProject, {
                    upsert: true,
                }); //returns query!?
            }

            res.status(200).send('success');
        } catch (err) {
            res.status(500).send(
                'sorry, could not create project. please try again'
            );
            console.log(err);
        }
    });

    app.post('/api/private/create/project', async function(req, res) {
        try {
            if (req.body.story.length / Math.pow(1024, 1) > 10)
                throw new Error('Story size is larger than allowed'); //greater than 10kb)

            const slug = shortid.generate();

            var newProject = project({
                name: req.body.name,
                slug: slug,
                slug_id: slug,
                title: req.body.title.substring(0, 100),
                founder: req.active_user.account,
                owner: req.active_user.account,
                description: req.body.description.substring(0, 160),
                story: req.body.story,
                state: 'active',
                member_count: 1,
                report_count: 0,
                type: 'community',
                created: new Date(),
                last_update: new Date(),
                members: {
                    account: req.active_user.account,
                    role: 'owner',
                    state: 'active',
                    type: 'team',
                    created: new Date(),
                },
            });

            var newActivity = activity({
                title: req.body.title,
                slug_id: '/project/' + slug,
                action: 'create',
                type: 'project',
                source: 'user',
                account: req.active_user.account,
                description:
                    '@' +
                    req.active_user.account +
                    ' just created a new project: ' +
                    req.body.name,
                created: Date.now(),
            });

            var updatePeer = {
                $inc: { project_count: 1 },
                badge: 'builder',
                last_update: Date.now(),
                last_project_slug_id: slug,
                last_project_title: req.body.title,
                $push: {
                    memberships: {
                        name: req.body.title,
                        slug_id: slug,
                        state: 'active',
                        role: 'owner',
                        type: 'team',
                        created: new Date(),
                    },
                },
            };

            await newProject.save();
            await peer.updateOne(
                { account: req.active_user.account },
                updatePeer,
                { upsert: true }
            );
            await newActivity.save();

            await stats.updateOne(
                { identifier: 'default' },
                { $inc: { project_count: 1 } }
            );

            res.status(200).send(slug);
        } catch (err) {
            res.status(500).send(
                'sorry, could not create project. please try again'
            );
            console.log(err);
        }
    });

    app.post('/api/private/create/request', async function(req, res) {
        try {
            var newRequest = {
                $addToSet: {
                    members: {
                        account: req.active_user.account,
                        state: 'pending',
                        created: new Date(),
                    },
                },
            };

            var newActivity = activity({
                title: req.body.name,
                slug_id: '/project/' + req.body.slug_id,
                action: 'create',
                type: 'request',
                source: 'user',
                account: req.active_user.account,
                description:
                    '@' +
                    req.active_user.account +
                    ' asked to join: ' +
                    req.body.name,
                created: Date.now(),
            });

            var updatePeer = {
                last_update: Date.now(),
                $addToSet: {
                    memberships: {
                        name: req.body.name,
                        state: 'pending',
                        slug_id: req.body.slug_id,
                        created: new Date(),
                    },
                },
            };

            await project.updateOne(
                {
                    slug_id: req.body.slug_id,
                    'members.account': { $ne: req.active_user.account },
                },
                newRequest,
                { upsert: true }
            );

            await peer.updateOne(
                {
                    account: req.active_user.account,
                    'memberships.slug_id': { $ne: req.body.slug_id },
                },
                updatePeer,
                { upsert: true }
            );

            await newActivity.save();

            await stats.updateOne(
                { identifier: 'default' },
                { $inc: { request_count: 1 } }
            );

            res.status(200).send('success');
        } catch (err) {
            res.status(500).send(
                'sorry, could not create request. please try again'
            );
            console.log(err);
        }
    });
};