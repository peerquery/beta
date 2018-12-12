'use strict';

var relation = require('../../models/relation');
var peer = require('../../models/peer');
var activity = require('../../models/activity');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.get('/api/relations/following/:account/:last_id', async function(
        req,
        res
    ) {
        try {
            //users being followed by this user
            let query = 'updated following';
            let options;

            if (req.params.last_id == 0) {
                options = {
                    follower: req.params.account,
                    state: 'active',
                };
            } else {
                options = {
                    follower: req.params.account,
                    state: 'active',
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await relation
                .find(options)
                .select(query)
                .limit(20)
                .sort({ updated: -1 });

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/relations/followers/:account/:last_id', async function(
        req,
        res
    ) {
        try {
            //users following this user
            let query = 'updated follower';
            let options;

            if (req.params.last_id == 0) {
                options = {
                    following: req.params.account,
                    state: 'active',
                };
            } else {
                options = {
                    following: req.params.account,
                    state: 'active',
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await relation
                .find(options)
                .select(query)
                .limit(20)
                .sort({ updated: -1 });

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/relations/supporters/:account/:last_id', async function(
        req,
        res
    ) {
        try {
            let query = 'updated follower benefactor_rate';
            let options;

            if (req.params.last_id == 0) {
                options = {
                    following: req.params.account,
                    state: 'active',
                    benefactor_rate: { $gt: 0 },
                };
            } else {
                options = {
                    following: req.params.account,
                    state: 'active',
                    benefactor_rate: { $gt: 0 },
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await relation
                .find(options)
                .select(query)
                .limit(20)
                .sort({ updated: -1 });

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/relation/:user', async function(req, res) {
        try {
            let results = await relation
                .findOne({
                    identifier: req.active_user.account + '_' + req.params.user,
                })
                .select('state');

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.post('/api/relations/follow', async function(req, res) {
        try {
            if (req.active_user.account == req.body.account)
                return res.status(405).send('you cannot follow yourself');

            //new follow object
            var update = {
                identifier: req.active_user.account + '_' + req.body.account,
                follower: req.active_user.account,
                following: req.body.account,
                state: 'active',
            };

            await relation.updateOne(
                {
                    identifier:
                        req.active_user.account + '_' + req.body.account,
                },
                update,
                { upsert: true }
            );

            //update follower
            await peer.updateOne(
                { account: req.active_user.account },
                { $inc: { following_count: 1 } }
            );

            //update followed
            await peer.updateOne(
                { account: req.body.account },
                { $inc: { followers_count: 1 } }
            );

            var newActivity = activity({
                slug_id: req.body.account,
                action: 'unfollowed_user',
                account: req.active_user.account,
                updated: Date.now(),
            });

            await newActivity.save();

            res.status(200).send('success');
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.post('/api/relations/unfollow', async function(req, res) {
        try {
            var results = await relation
                .findOneAndUpdate(
                    {
                        identifier:
                            req.active_user.account + '_' + req.body.account,
                    },
                    { $set: { state: 'inactive', benefactor_rate: 0 } }
                )
                .select('benefactor_rate');

            var updateFollower = {};
            var updateFollowed = {};

            if (results && results.benefactor_rate > 0) {
                updateFollower.$inc = {
                    following_count: -1,
                    beneficiaries_count: -1,
                    beneficiaries_percentage: -results.benefactor_rate,
                };
                updateFollowed.$inc = {
                    followers_count: -1,
                    benefactors_count: -1,
                };
            } else {
                updateFollower.$inc = { following_count: -1 };
                updateFollowed.$inc = { followers_count: -1 };
            }

            //update follower
            await peer.updateOne(
                { account: req.active_user.account },
                updateFollower
            );

            //update followed
            await peer.updateOne({ account: req.body.account }, updateFollowed);

            var newActivity = activity({
                slug_id: req.body.account,
                action: 'unfollowed_user',
                account: req.active_user.account,
                updated: Date.now(),
            });

            await newActivity.save();

            res.status(200).send('success');
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
};
