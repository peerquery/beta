'use strict';

var peer = require('../../models/peer'),
    activity = require('../../models/activity'),
    message = require('../../models/message'),
    notification = require('../../models/notification'),
    uuid = require('../../lib/helpers/uuid'),
    project = require('../../models/project');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    //approve membership request
    app.post('/api/private/project/approve_membership', async function(
        req,
        res
    ) {
        try {
            let can_approve = await project.findOne(
                { slug_id: req.body.project_slug_id },
                {
                    members: {
                        $elemMatch: {
                            account: req.active_user.account,
                            type: 'team',
                        },
                    },
                }
            );

            if (can_approve.members.length) {
                let approve_request = await project.updateOne(
                    {
                        slug_id: req.body.project_slug_id,
                        'members.account': req.body.account,
                    },
                    {
                        $set: {
                            'members.$.state': 'active',
                            'members.$.type': 'member',
                        },
                        $inc: { member_count: 1 },
                    }
                );

                let membership_updated = await peer.updateOne(
                    {
                        account: req.body.account,
                        'memberships.slug_id': req.body.project_slug_id,
                    },
                    {
                        $set: {
                            'memberships.$.state': 'active',
                            'membership.$.type': 'member',
                        },
                        $inc: { project_membership_count: 1 },
                    }
                );

                if (approve_request && membership_updated) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(500);
                }

                var newActivity = activity({
                    slug_id: req.body.project_slug_id,
                    action: 'approve_membership',
                    account: req.active_user.account,
                    created: Date.now(),
                });

                var project_messages = await project
                    .findOne({ identifier: 'default' })
                    .select('new_member_message_title new_member_message_body');

                var newMessage = message({
                    slug_id: uuid(),

                    author: req.body.project_slug_id,
                    recipient: req.body.account,

                    title: project_messages.new_user_message_title,
                    body: project_messages.new_user_message_body,

                    event: 'project_membership_approved',
                    state: 'pending',
                    relation: 'project_2_user',
                    created: Date.now(),
                });

                await newMessage.save();

                await newActivity.save();
            }
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
            let can_remove = await project.findOne(
                { slug_id: req.body.project_slug_id },
                {
                    members: {
                        $elemMatch: {
                            account: req.active_user.account,
                            type: 'team',
                        },
                    },
                }
            );

            if (can_remove.members.length) {
                let leave_project = await project.updateOne(
                    { slug_id: req.body.project_slug_id },
                    {
                        $pull: {
                            members: {
                                account: req.body.account,
                                role: { $ne: 'owner' },
                            },
                        },
                        $inc: { member_count: -1 },
                    }
                );

                let update_user = await peer.updateOne(
                    { account: req.body.account },
                    {
                        $pull: {
                            memberships: {
                                slug_id: req.body.project_slug_id,
                                role: { $ne: 'owner' },
                            },
                        },
                        $inc: { project_membership_count: -1 },
                    }
                );

                if (leave_project && update_user) {
                    var newNotification = notification({
                        event: 'project_membership_removed',
                        from: req.body.project_slug_id,
                        from_account: req.active_user.account,
                        relation: 'project_2_user',
                        to: req.active_user.account,
                        status: 'pending',
                        created: Date.now(),
                    });

                    await newNotification.save();

                    res.sendStatus(200);
                } else {
                    res.sendStatus(500);
                }
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    //reject membership
    app.post('/api/private/project/reject_membership', async function(
        req,
        res
    ) {
        try {
            let reject_request = await project.updateOne(
                { slug_id: req.body.project_slug_id },
                { $pull: { members: { account: req.body.account } } }
            );

            let update_user = await peer.updateOne(
                { account: req.body.account },
                {
                    $pull: {
                        memberships: { slug_id: req.body.project_slug_id },
                    },
                }
            );

            if (reject_request && update_user) {
                var newNotification = notification({
                    event: 'project_membership_rejected',
                    from: req.body.project_slug_id,
                    from_account: req.active_user.account,
                    relation: 'project_2_user',
                    to: req.active_user.account,
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

    //leave project
    app.post('/api/private/project/leave_membership', async function(req, res) {
        try {
            let leave_project = await project.findOneAndUpdate(
                { slug_id: req.body.project_slug_id },
                {
                    $pull: {
                        members: {
                            account: req.active_user.account,
                            role: { $ne: 'owner' },
                        },
                    },
                },
                { fields: { state: 1 } }
            );

            let update_user = await peer.updateOne(
                { account: req.active_user.account },
                {
                    $pull: {
                        memberships: {
                            slug_id: req.body.project_slug_id,
                            role: { $ne: 'owner' },
                        },
                    },
                }
            );

            //reduce member count only if user's state was *active* not *pending*
            if (leave_project && leave_project.state == 'active') {
                let update_member_count = await project.updateOne(
                    { slug_id: req.body.project_slug_id },
                    { $inc: { member_count: -1 } }
                );
            }

            if (leave_project && update_user) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
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
            let upgrade_membership = await project.updateOne(
                {
                    slug_id: req.body.project_slug_id,
                    'members.account': req.body.account,
                },
                { $set: { 'members.$.type': 'team' } }
            );

            let update_user = await peer.updateOne(
                {
                    account: req.body.account,
                    'memberships.slug_id': req.body.project_slug_id,
                },
                { $set: { 'memberships.$.type': 'team' } }
            );

            if (upgrade_membership && update_user) {
                var newNotification = notification({
                    event: 'project_membership_left',
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
