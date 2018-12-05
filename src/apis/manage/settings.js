'use strict';

let activity = require('../../models/activity'),
    peer = require('../../models/peer'),
    project = require('../../models/project'),
    stats = require('../../models/stats'),
    notification = require('../../models/notification');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.post('/api/private/project/export', async function(req, res) {
        try {
            let query = {
                slug_id: req.body.slug_id,
                members: {
                    $elemMatch: {
                        account: req.active_user.account,
                        type: 'team',
                    },
                },
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
            //change ownership on project
            let query1 = {
                slug_id: req.body.slug_id,
                owner: req.active_user.account,
                members: {
                    $elemMatch: { account: req.body.new_owner, type: 'team' },
                },
            };
            let update1 = { $set: { owner: req.body.new_owner } };
            let status1 = await project.updateOne(query1, update1);

            //update previous owner role on project
            let query2 = {
                slug_id: req.body.slug_id,
                'members.account': req.active_user.account,
            };
            let update2 = { $set: { 'members.$.role': 'admin' } };
            let status2 = await project.updateOne(query2, update2);

            //update new owner role on project
            let query3 = {
                slug_id: req.body.slug_id,
                'members.account': req.body.new_owner,
            };
            let update3 = { $set: { 'members.$.role': 'owner' } };
            let status3 = await project.updateOne(query3, update3);

            //update previous owner role on profile
            let query4 = {
                account: req.active_user.account,
                'memberships.slug_id': req.body.slug_id,
            };
            let update4 = { $set: { role: 'admin' } };
            let status4 = await peer.updateOne(query4, update4);

            //update previous owner project_count
            let query5 = {
                account: req.active_user.account,
            };
            let update5 = {
                $inc: { project_count: -1, project_membership_count: -1 },
            };
            let status5 = await peer.updateOne(query5, update5);

            //update new owner role on profile
            let query6 = {
                account: req.body.new_owner,
                'memberships.slug_id': req.body.slug_id,
            };
            let update6 = { $set: { role: 'owner' } };
            let status6 = await peer.updateOne(query6, update6);

            //update new owner project_count
            let query7 = {
                account: req.body.new_owner,
            };
            let update7 = {
                $inc: { project_count: 1, project_membership_count: 1 },
            };
            let status7 = await peer.updateOne(query7, update7);

            if (
                !status1 ||
                !status2 ||
                !status3 ||
                !status4 ||
                !status5 ||
                !status6 ||
                !status7
            )
                return res.sendStatus(500);

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

            let status1 = await project.findOneAndDelete({
                slug_id: req.body.slug_id,
                owner: req.active_user.account,
            });

            //update activity stream
            var newActivity = activity({
                slug_id: req.body.slug_id,
                action: 'delete_project',
                account: req.active_user.account,
                created: Date.now(),
            });
            await newActivity.save();

            //delete project listing from user profile
            let query2 = { account: req.active_user.account };
            let update2 = {
                $pull: { memberships: { slug_id: req.body.slug_id } },
                $inc: { project_count: -1, project_membership_count: -1 },
            };
            let status2 = await peer.updateOne(query2, update2);

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
