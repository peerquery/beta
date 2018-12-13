'use strict';

const peer = require('../../models/peer'),
    activity = require('../../models/activity'),
    message = require('../../models/message'),
    notification = require('../../models/notification'),
    membership = require('../../models/membership'),
    project = require('../../models/project'),
    uuid = require('../../lib/helpers/uuid'),
    config = require('../../configs/config');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    //approve membership request
    app.post('/api/private/project/approve_membership', async function(
        req,
        res
    ) {
        try {
            let active_membership_info = await membership
                .findOne({
                    identifier:
                        req.active_user.account +
                        '_' +
                        req.body.project_slug_id,
                })
                .lean()
                .select('state type');

            if (
                active_membership_info.type !== 'team' ||
                active_membership_info.state !== 'active'
            )
                return res
                    .state(405)
                    .send(
                        'only active team mebers can manage project memebers'
                    );

            let approve_membership = await membership.updateOne(
                {
                    identifier:
                        req.body.account + '_' + req.body.project_slug_id,
                },

                { $set: { state: 'active' } }
            );

            var project_messages = await project
                .findOneAndUpdate(
                    { slug_id: req.body.project_slug_id },
                    { $inc: { member_count: 1, pending_count: -1 } }
                )
                .select('new_member_message_title new_member_message_body');

            await peer.updateOne(
                { active: req.active_user.account },
                { $inc: { project_membership_count: 1 } }
            );

            var newMessage = message({
                slug_id: uuid(),

                author: req.body.project_slug_id,
                recipient: req.body.account,

                title:
                    project_messages.new_member_message_title ||
                    config.new_member_message_title,
                body:
                    project_messages.new_member_message_body ||
                    config.new_member_message_body,

                event: 'project_membership_approved',
                state: 'pending',
                relation: 'project_2_user',
                created: Date.now(),
            });

            var newNotification = notification({
                event: 'project_membership_approved',
                from: req.body.project_slug_id,
                from_account: req.active_user.account,
                relation: 'project_2_user',
                to: req.body.account,
                status: 'pending',
                created: Date.now(),
            });

            await newNotification.save();

            var newActivity = activity({
                slug_id: req.body.project_slug_id,
                action: 'approve_membership',
                account: req.active_user.account,
                created: Date.now(),
            });

            await newMessage.save();

            await newActivity.save();

            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    //remove project membership
    app.post('/api/private/project/remove_membership', async function(
        req,
        res
    ) {
        try {
            let active_membership_info = await membership
                .findOne({
                    identifier:
                        req.active_user.account +
                        '_' +
                        req.body.project_slug_id,
                })
                .lean()
                .select('state type');

            if (
                active_membership_info.type !== 'team' ||
                active_membership_info.state !== 'active'
            )
                return res
                    .state(405)
                    .send(
                        'only active team members can manage project memebers'
                    );

            let membership_info = await membership
                .findOneAndUpdate(
                    {
                        identifier:
                            req.body.account + '_' + req.body.project_slug_id,
                    },
                    { $set: { state: 'inactive', benefactor_rate: 0 } }
                )
                .select('benefactor_rate state type role');

            if (membership_info.role == 'owner')
                return res.state(405).send('cannot remove owner from project');

            let delete_membership = await project.deleteOne({
                identifier: req.body.account + '_' + req.body.project_slug_id,
            });

            var userUpdate;
            var projectUpdate;

            if (membership_info.benefactor_rate > 0) {
                userUpdate.$inc = {
                    benefactor_percentage: -membership_info.benefactor_rate,
                    beneficiaries_count: -1,
                    project_membership_count: -1,
                };
                projectUpdate.$inc = {
                    benefactors_count: -1,
                    member_count: -1,
                };
                if (membership_info.type == 'team')
                    projectUpdate.$inc = {
                        benefactors_count: -1,
                        member_count: -1,
                        team_count: -1,
                    };
            } else {
                userUpdate.$inc = { project_membership_count: -1 };
                projectUpdate.$inc = { member_count: -1 };
            }

            //update user's account
            await peer.updateOne({ account: req.body.account }, userUpdate);

            //update project
            await project.updateOne(
                { slug_id: req.body.project_slug_id },
                projectUpdate
            );

            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    //reject project
    app.post('/api/private/project/reject_membership', async function(
        req,
        res
    ) {
        try {
            let active_membership_info = await membership
                .findOne({
                    identifier:
                        req.active_user.account +
                        '_' +
                        req.body.project_slug_id,
                })
                .lean()
                .select('state type');

            if (
                active_membership_info.type !== 'team' ||
                active_membership_info.state !== 'active'
            )
                return res
                    .state(405)
                    .send(
                        'only active team members can manage project memebers'
                    );

            let delete_membership = await membership.deleteOne({
                identifier: req.body.account + '_' + req.body.project_slug_id,
            });

            await membership.updateOne(
                { slug_id: req.body.project_slug_id },
                { $inc: { pending_count: -1 } }
            );

            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    //leave project
    app.post('/api/private/project/leave_membership', async function(req, res) {
        try {
            let membership_info = await membership
                .findOneAndUpdate(
                    {
                        identifier:
                            req.active_user.account +
                            '_' +
                            req.body.project_slug_id,
                    },
                    { $set: { state: 'inactive', benefactor_rate: 0 } }
                )
                .select('benefactor_rate state type role');

            if (membership_info.role == 'owner')
                return res.state(405).send('owner cannot leave their projects');

            let delete_membership = await membership.deleteOne({
                identifier:
                    req.active_user.account + '_' + req.body.project_slug_id,
            });

            var userUpdate;
            var projectUpdate;

            if (membership_info.benefactor_rate > 0) {
                //automatically means that user's account state is not 'pending'

                userUpdate.$inc = {
                    benefactor_percentage: -membership_info.benefactor_rate,
                    beneficiaries_count: -1,
                    project_membership_count: -1,
                };
                projectUpdate.$inc = {
                    benefactors_count: -1,
                    member_count: -1,
                };
                if (membership_info.type == 'team')
                    projectUpdate.$inc = {
                        benefactors_count: -1,
                        member_count: -1,
                        team_count: -1,
                    };
            } else {
                //user may be active but not a benefactor, or may be pending

                if (membership_info.state !== 'pending') {
                    //user is active

                    userUpdate.$inc = { project_membership_count: -1 };
                    projectUpdate.$inc = { member_count: -1 };
                    if (membership_info.type == 'team')
                        projectUpdate.$inc = {
                            member_count: -1,
                            team_count: -1,
                        };
                } else {
                    //user is pending
                    userUpdate = {};
                    projectUpdate = {};
                }
            }

            //update user's account
            await peer.updateOne(
                { account: req.active_user.account },
                userUpdate
            );

            //update project
            await project.updateOne(
                { slug_id: req.body.project_slug_id },
                projectUpdate
            );

            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    //upgrade project membership - make member a team member
    app.post('/api/private/project/upgrade_membership', async function(
        req,
        res
    ) {
        try {
            let active_membership_info = await membership
                .findOne({
                    identifier:
                        req.active_user.account +
                        '_' +
                        req.body.project_slug_id,
                })
                .lean()
                .select('state type');

            if (
                active_membership_info.type !== 'team' ||
                active_membership_info.state !== 'active'
            )
                return res
                    .state(405)
                    .send(
                        'only active team mebers can manage project memebers'
                    );

            var update = {};

            if (req.body.role) update.role = req.body.role;
            update.type = 'team';
            update.state = 'active';

            let upgrade_membership = await membership.updateOne(
                {
                    identifier:
                        req.body.account + '_' + req.body.project_slug_id,
                },

                { $set: { update } }
            );

            await project.updateOne(
                {
                    slug_id: req.body.project_slug_id,
                },

                { $inc: { team_count: 1 } }
            );

            if (upgrade_membership) {
                var newNotification = notification({
                    event: 'project_membership_upgrade',
                    from: req.body.project_slug_id,
                    from_account: req.active_user.account,
                    relation: 'project_2_user',
                    to: req.body.account,
                    status: 'pending',
                    created: Date.now(),
                });

                await newNotification.save();

                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
};
