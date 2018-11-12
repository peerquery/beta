'use strict';

var peer = require('../../models/peer'),
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
                    },
                    { upsert: true }
                );

                let update_member_count = await project.updateOne(
                    { slug_id: req.body.project_slug_id },
                    { $inc: { member_count: 1 } }
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
                    },
                    { upsert: true }
                );

                if (approve_request && membership_updated) {
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
                    }
                );

                let update_member_count = await project.updateOne(
                    { slug_id: req.body.project_slug_id },
                    { $inc: { member_count: -1 } }
                );

                if (leave_project && update_user) {
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
                { $set: { 'members.$.type': 'team' } },
                { upsert: true }
            );

            let update_user = await peer.updateOne(
                {
                    account: req.body.account,
                    'memberships.slug_id': req.body.project_slug_id,
                },
                { $set: { 'memberships.$.type': 'team' } },
                { upsert: true }
            );

            if (upgrade_membership && update_user) {
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
