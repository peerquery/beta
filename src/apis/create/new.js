'use strict';

const shortid = require('shortid'),
    markup = require('markup-builder'),
    uuid = require('../../lib/helpers/uuid'),
    config = require('../../configs/config'),
    activity = require('../../models/activity'),
    peer = require('../../models/peer'),
    stats = require('../../models/stats'),
    report = require('../../models/report'),
    query = require('../../models/query'),
    project = require('../../models/project'),
    membership = require('../../models/membership'),
    message = require('../../models/message'),
    hire = require('../../models/hire'),
    settings = require('../../models/settings'),
    notification = require('../../models/notification');
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
                slug_id: req.body.permlink,
                action: 'create_report',
                account: req.active_user.account,
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
                author: req.active_user.account,
                query_id: uuid(),
                title: req.body.title,
                body: req.body.body,
                permlink: req.body.permlink,
                project_title: project_title,
                project_slug_id: project_slug_id,
                reward_form: req.body.rewardForm,
                email: req.body.email,
                telephone: req.body.telephone,
                website: req.body.website,
                label: req.body.label,
                type: req.body.type,
                deadline: req.body.deadline,
                view_count: 1,
                image: req.body.image,
                description: req.body.description,
                created: new Date(),
            });

            var newActivity = activity({
                slug_id: req.body.permlink,
                action: 'create_query',
                account: req.active_user.account,
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
                steem: req.body.steem,
                slug: slug,
                slug_id: slug,
                title: req.body.title.substring(0, 100),
                founder: req.active_user.account,
                owner: req.active_user.account,
                description: req.body.description.substring(0, 160),
                story: req.body.story,
                state: 'active',
                member_count: 1,
                team_count: 1,
                report_count: 0,
                type: 'community',
                created: new Date(),
                last_update: new Date(),
            });

            await newProject.save();

            var newMembership = membership({
                identifier: req.active_user.account + '_' + slug,
                title: req.body.req.body.title.substring(0, 100),
                slug_id: slug,
                steem: req.body.steem,
                role: 'owner',
                type: 'team',
                state: 'active',
                account: req.active_user.account,

                created: new Date(),
            });

            await newMembership.save();

            //update peer's membership and project details
            var updatePeer = {
                $inc: { project_count: 1, project_membership_count: 1 },
                last_update: Date.now(),
                last_project_slug_id: slug,
                last_project_title: req.body.title,
            };

            await peer.updateOne(
                { account: req.active_user.account },
                updatePeer
            );

            var newActivity = activity({
                action: 'create_project',
                slug_id: slug,
                account: req.active_user.account,
                created: Date.now(),
            });

            await newActivity.save();

            await stats.updateOne(
                { identifier: 'default' },
                { $inc: { project_count: 1 } }
            );

            var setting = await settings
                .findOne({ identifier: 'default' })
                .select(
                    'new_project_message_title new_project_message_body account'
                );

            var newMessage = message({
                slug_id: uuid(),

                author: setting.account || config.steem_account,
                recipient: req.active_user.account,

                title:
                    setting.new_project_message_title ||
                    config.new_project_message_title,
                body:
                    setting.new_project_message_body ||
                    config.new_project_message_body,

                event: 'create_project',
                state: 'pending',
                relation: 'site_2_user',
                created: Date.now(),
            });

            await newMessage.save();

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
            //get the user's object id
            const project_id = await project
                .findOneAndUpdate(
                    { slug_id: req.body.slug_id },
                    { $inc: { pending_count: 1 } }
                )
                .select('title steem owner _id');

            //add user to memberships
            var update = {
                identifier: req.active_user.account + '_' + req.body.slug_id,
                title: project_id.title,
                steem: project_id.steem || project_id.owner,
                slug_id: req.body.slug_id,
                role: '',
                type: 'member',
                state: 'pending',
                account: req.active_user.account,

                created: new Date(),
            };

            await membership.findOneAndUpdate(
                {
                    identifier:
                        req.active_user.account + '_' + req.body.slug_id,
                },
                update,
                { upsert: true }
            );

            var newActivity = activity({
                slug_id: req.body.slug_id,
                action: 'request_project_membership',
                account: req.active_user.account,
                created: Date.now(),
            });

            await newActivity.save();

            await stats.updateOne(
                { identifier: 'default' },
                { $inc: { request_count: 1 } }
            );

            var newNotification = notification({
                event: 'request_project_membership',
                from: req.active_user.account,
                to: req.body.slug_id,
                relation: 'user_2_project',
                status: 'pending',
                created: Date.now(),
            });

            await newNotification.save();

            res.status(200).send('success');
        } catch (err) {
            res.status(500).send(
                'sorry, could not create request. please try again'
            );
            console.log(err);
        }
    });

    app.post('/api/private/create/message', async function(req, res) {
        try {
            if (req.body.recipient == req.active_user.account)
                return res
                    .status(405)
                    .send('sorry, you cannot message yourself');

            let messaged_target;

            if (req.body.target == 'user')
                messaged_target = await peer
                    .findOneAndUpdate(
                        { account: req.body.recipient },
                        { $inc: { received_messages: 1 } }
                    )
                    .select('messaging');

            if (req.body.target == 'project')
                messaged_target = await peer
                    .findOneAndUpdate(
                        { slug_id: req.body.recipient },
                        { $inc: { received_messages: 1 } }
                    )
                    .select('messaging');

            if (!messaged_target)
                return res
                    .status(404)
                    .send('sorry, intended recipient does not exist');

            if (
                messaged_target.messaging &&
                messaged_target.messaging == 'false'
            )
                return res
                    .status(401)
                    .send('sorry, user does not permit messaging');

            const slug = uuid();

            var newMessage = message({
                slug_id: slug,
                event: 'message',
                parent: req.body.parent ? req.body.parent : '',

                author: req.active_user.account,
                recipient: req.body.recipient,

                title: req.body.title,
                body: req.body.body,

                state: 'pending',
                relation: 'user_2_' + req.body.target,
                created: Date.now(),
            });

            await newMessage.save();

            var newActivity = activity({
                action: 'create_user_message',
                target: req.body.recipient,
                account: req.active_user.account,
                created: Date.now(),
            });

            await newActivity.save();

            res.status(200).send('success');
        } catch (err) {
            res.status(500).send(
                'sorry, could not create message. please try again'
            );
            console.log(err);
        }
    });

    app.post('/api/private/create/hire', async function(req, res) {
        try {
            //check for conflict of interest?!
            if (req.body.recipient == req.active_user.account)
                return res.status(405).send('sorry, you cannot hire yourself');

            //check if target query exists
            var query_details = await query
                .findOne({ query_id: req.body.query_id })
                .select('title permlink');

            if (
                !query_details ||
                !query_details.title ||
                !query_details.permlink
            )
                return res
                    .status(404)
                    .send('sorry, intended query does not exist');

            //check if intended user supports hiring
            let hiring_target = await peer.findOneAndUpdate(
                {
                    account: req.body.recipient,
                    hiring: { $nin: ['false', false] },
                },
                { $inc: { received_hires: 1 } }
            );

            if (!hiring_target)
                return res
                    .status(404)
                    .send(
                        'sorry, intended recipient does not exist or does not support hiring'
                    );

            var newHire = hire({
                event: 'hire',
                query_id: req.body.query_id,

                author: req.active_user.account,
                recipient: req.body.recipient,

                title: query_details.title,
                permlink: query_details.permlink,

                state: 'pending',
                relation: 'user_2_' + req.body.target,
                created: Date.now(),
            });

            await newHire.save();

            //update sender's stats
            await peer.findOneAndUpdate(
                { account: req.active_user.account },
                { $inc: { sent_hires: 1 } }
            );

            //update global stats
            await stats.updateOne(
                { identifier: 'default' },
                { $inc: { hires_count: 1 } }
            );

            var newActivity = activity({
                action: 'create_user_hire',
                target: req.body.recipient,
                account: req.active_user.account,
                created: Date.now(),
            });

            await newActivity.save();

            res.status(200).send('success');
        } catch (err) {
            res.status(500).send(
                'sorry, could not create hire. please try again'
            );
            console.log(err);
        }
    });
};
