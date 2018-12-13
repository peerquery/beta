'use strict';

let activity = require('../../models/activity'),
    peer = require('../../models/peer'),
    project = require('../../models/project'),
    membership = require('../../models/membership'),
    stats = require('../../models/stats'),
    notification = require('../../models/notification');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.post('/api/private/project/export', async function(req, res) {
        try {
            let query = {
                slug_id: req.body.slug_id,
                owner: req.active_user.account,
            };

            let type = req.body.type;

            let response = await project.findOne(query, { _id: 0 });

            if (!response) return res.status(500);

            res.status(200).json(response);
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    });

    app.post('/api/private/project/transfer', async function(req, res) {
        try {
            if (req.active_user.account == req.body.new_owner)
                return res.sendStatus(405);

            //change owners in membership
            var success = await membership.updateOne(
                {
                    identifier: req.new_owner.account + '_' + req.body.slug_id,
                    type: 'team',
                },
                { $set: { role: 'owner' } }
            );

            //if user is not a team member of the project!
            if (!success) return res.sendStatus(405);

            //change ownership on project
            await project.updateOne(
                { slug_id: req.body.slug_id, owner: req.active_user.account },
                { $set: { owner: req.active_user.account } }
            );

            //change old owner in membership
            await membership.updateOne(
                {
                    identifier:
                        req.active_user.account + '_' + req.body.slug_id,
                },
                { $set: { role: 'team' } }
            );

            //update user accounts
            await peer.updateOne(
                { account: req.new_owner.account },
                { $inc: { project_count: 1 } }
            );
            await peer.updateOne(
                { account: req.active_user.account },
                { $inc: { project_count: -1 } }
            );

            var newNotification = notification({
                event: 'project_tranfer',
                from: req.body.slug_id,
                relation: 'project_2_user',
                from_account: req.active_user.account,
                to: req.body.new_owner,
                status: 'pending',
                created: Date.now(),
            });

            await newNotification.save();

            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    });

    app.post('/api/private/project/delete', async function(req, res) {
        try {
            //delete project

            await project.findOneAndDelete({
                slug_id: req.body.slug_id,
                owner: req.active_user.account,
            });
            let membership_info = membership
                .findOneAndDelete({
                    identifier:
                        req.active_user.account + '_' + req.body.slug_id,
                })
                .select('benefactor_rate');

            //update activity stream
            var newActivity = activity({
                slug_id: req.body.slug_id,
                action: 'delete_project',
                account: req.active_user.account,
                created: Date.now(),
            });
            await newActivity.save();

            //delete project listing from user profile
            let userQuery = { account: req.active_user.account };
            let userUpdate = {};

            userUpdate.$inc = {
                project_count: -1,
                project_membership_count: -1,
                beneficiaries_count: -1,
            };
            if (membership_info.benefactor_rate > 0)
                userUpdate.$inc = {
                    project_count: -1,
                    project_membership_count: -1,
                    beneficiaries_count: -1,
                    beneficiaries_percentage: -membership_info.benefactor_rate,
                };

            await peer.updateOne(userQuery, userUpdate);

            //reduce project count on stats
            await stats.updateOne(
                { identifier: 'default' },
                { $inc: { project_delete_count: 1 } }
            );

            var newNotification = notification({
                event: 'project_delete',
                from: req.body.slug_id,
                relation: 'project_2_user',
                from_account: req.active_user.account,
                to: req.active_user.account,
                status: 'pending',
                created: Date.now(),
            });

            await newNotification.save();

            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    });
};
