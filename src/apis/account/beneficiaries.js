'use strict';

const activity = require('../../models/activity'),
    membership = require('../../models/membership'),
    relation = require('../../models/relation'),
    message = require('../../models/message'),
    team = require('../../models/team'),
    peer = require('../../models/peer'),
    project = require('../../models/project'),
    stats = require('../../models/stats'),
    config = require('../../configs/config'),
    uuid = require('../../lib/helpers/uuid');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.get('/api/private/beneficiaries', async function(req, res) {
        try {
            var project_beneficiaries = await membership
                .find(
                    {
                        account: req.active_user.account,
                        steem: { $nin: [null, ''] },
                        benefactor_rate: { $gt: 0 },
                    },
                    {
                        steem: 1,
                        title: 1,
                        slug_id: 1,
                        benefactor_rate: 1,
                        benefactor_created: 1,
                        benefactor_label: 1,
                        benefactor_message: 1,
                        _id: 0,
                    }
                )
                .lean();

            var peer_beneficiaries = await relation
                .find(
                    {
                        follower: req.active_user.account,
                        benefactor_rate: { $gt: 0 },
                    },
                    {
                        following: 1,
                        benefactor_rate: 1,
                        benefactor_created: 1,
                        benefactor_label: 1,
                        benefactor_message: 1,
                        _id: 0,
                    }
                )
                .lean();

            var results = {};
            results.projects = project_beneficiaries;
            results.peers = peer_beneficiaries;

            res.status(200).json(results);
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });

    app.get('/api/private/beneficiaries/list', async function(req, res) {
        try {
            var project_beneficiaries = await membership
                .find(
                    {
                        account: req.active_user.account,
                        steem: { $nin: [null, ''] },
                        benefactor_rate: { $gt: 0 },
                    },
                    { steem: 1, benefactor_rate: 1, _id: 0 }
                )
                .lean();

            var peer_beneficiaries = await relation
                .find(
                    {
                        follower: req.active_user.account,
                        benefactor_rate: { $gt: 0 },
                    },
                    { following: 1, benefactor_rate: 1, _id: 0 }
                )
                .lean();

            var results = {};
            results.projects = project_beneficiaries;
            results.peers = peer_beneficiaries;

            res.status(200).json(results);
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });

    app.post('/api/private/beneficiary/add', async function(req, res) {
        try {
            var messages;
            var success;
            let statsUpdate = {};

            if (req.body.type == 'project') {
                //prepare stats
                statsUpdate.$inc = { project_benefactors_count: 1 };

                success = await membership.updateOne(
                    {
                        identifier:
                            req.active_user.account + '_' + req.body.target,
                        state: { $ne: 'pending' },
                        steem: { $nin: [null, ''] },
                    },
                    {
                        $set: {
                            benefactor_rate: req.body.rate,
                            benefactor_label: req.body.label,
                            benefactor_created: new Date(),
                            benefactor_message: req.body.message || '',
                        },
                    }
                );

                if (success) {
                    messages = await project
                        .findOneAndUpdate(
                            { slug_id: req.body.target },
                            { $inc: { benefactors_count: 1 } }
                        )
                        .select(
                            'new_benefactor_message_title new_benefactor_message_body'
                        );

                    await peer.updateOne(
                        { account: req.active_user.account },
                        {
                            $inc: {
                                beneficiaries_count: 1,
                                beneficiaries_percentage: req.body.rate,
                            },
                        }
                    );
                }
            } else if (req.body.type == 'user') {
                //prepare stats
                statsUpdate.$inc = { peer_benefactors_count: 1 };

                success = await relation.updateOne(
                    {
                        identifier:
                            req.active_user.account + '_' + req.body.target,
                        state: { $ne: 'pending' },
                    },
                    {
                        $set: {
                            benefactor_rate: req.body.rate,
                            benefactor_label: req.body.label,
                            benefactor_created: new Date(),
                        },
                    }
                );

                if (success) {
                    messages = await peer
                        .findOneAndUpdate(
                            { account: req.body.account },
                            { $inc: { benefactors_count: 1 } }
                        )
                        .select(
                            'new_benefactor_message_title new_benefactor_message_body'
                        );

                    await peer.updateOne(
                        { account: req.active_user.account },
                        {
                            $inc: {
                                beneficiaries_count: 1,
                                beneficiaries_percentage: req.body.rate,
                            },
                        }
                    );
                }
            }

            if (!success) {
                return res
                    .status(500)
                    .send('sorry, an err occured. please try again');
            } else {
                //update site activity
                var newActivity = activity({
                    slug_id: req.body.target,
                    action: 'add_' + req.body.type + '_beneficiary',
                    account: req.active_user.account,
                    created: Date.now(),
                });

                await newActivity.save();

                await stats.updateOne({ identifier: 'default' }, statsUpdate);

                //send custom new beneficiary messages from target

                var newMessage = message({
                    slug_id: uuid(),
                    author: req.active_user.account,
                    recipient: req.body.target,

                    title:
                        messages.new_benefactor_message_title ||
                        config.new_benefactor_message_title,
                    body:
                        messages.new_benefactor_message_body ||
                        config.new_benefactor_message_body,

                    event: req.body.type + '_beneficiary',
                    state: 'pending',
                    relation: 'user_2_' + req.body.type,
                    created: Date.now(),
                });

                await newMessage.save();

                res.status(200).send('sucessfully removed team');
            }
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });

    app.post('/api/private/beneficiary/remove', async function(req, res) {
        try {
            var success;

            if (req.body.type == 'project') {
                success = await membership
                    .findOneAndUpdate(
                        {
                            account: req.active_user.account,
                            identifier:
                                req.active_user.account + '_' + req.body.target,
                        },
                        { $set: { benefactor_rate: 0, benefactor_message: '' } }
                    )
                    .select('benefactor_rate');

                if (success) {
                    await project.updateOne(
                        { slug_id: req.body.target },
                        { $inc: { benefactors_count: -1 } }
                    );
                    await peer.updateOne(
                        { account: req.active_user.account },
                        {
                            $inc: {
                                beneficiaries_count: -1,
                                beneficiaries_percentage: -success.benefactor_rate,
                            },
                        }
                    );
                }
            } else if (req.body.type == 'user') {
                success = await relation
                    .findOneAndUpdate(
                        {
                            account: req.active_user.account,
                            identifier:
                                req.active_user.account + '_' + req.body.target,
                        },
                        { $set: { benefactor_rate: 0, benefactor_message: '' } }
                    )
                    .select('benefactor_rate');

                if (success) {
                    await peer.updateOne(
                        { account: req.body.target },
                        { $inc: { benefactors_count: -1 } }
                    );
                    await peer.updateOne(
                        { account: req.active_user.account },
                        {
                            $inc: {
                                beneficiaries_count: -1,
                                beneficiaries_percentage: -success.benefactor_rate,
                            },
                        }
                    );
                }
            }

            if (!success)
                return res
                    .status(500)
                    .send('sorry, an err occured. please try again');

            //update site activity
            var newActivity = activity({
                slug_id: req.body.target,
                action: 'remove_' + req.body.type + '_beneficiary',
                account: req.active_user.account,
                created: Date.now(),
            });

            await newActivity.save();

            res.status(200).send('sucessfully removed team');
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });
};
