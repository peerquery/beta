'use strict';

var activity = require('../../models/activity'),
    team = require('../../models/team'),
    peer = require('../../models/peer');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.get('/api/private/office/team/:type', async function(req, res) {
        try {
            var find = req.params.type;
            var query = { role: req.params.type, state: { $ne: 'inactive' } };

            if (find == 'core')
                query = {
                    role: {
                        $nin: [
                            'super_admin',
                            'admin',
                            'moderator',
                            'curator',
                            'owner',
                        ],
                    },
                    state: { $ne: 'inactive' },
                };
            if (find == 'inactive') query = { state: 'inactive' };

            var results = await team
                .find(query)
                .select('account email role label created -_id');

            res.status(200).json(results);
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });

    app.post('/api/private/office/team/add', async function(req, res) {
        try {
            var is_user = await peer
                .findOne({ account: req.body.account })
                .select('_id');

            if (!is_user) {
                res.status(405).send('does not have an account');
            } else {
                var newTeam = {
                    account: req.body.account,
                    enlister: req.active_user.account,
                    email: req.body.email,
                    role: req.body.role,
                    label: req.body.label,
                    about: req.body.about,
                    state: 'active',
                    created: new Date(),
                };

                await team.updateOne({ account: req.body.account }, newTeam, {
                    upsert: true,
                });

                //update site activity
                var newActivity = activity({
                    title: 'New member joined our team',
                    slug_id: '/team/' + req.body.account,
                    action: 'add',
                    type: 'team',
                    source: 'report',
                    account: req.active_user.account,
                    description:
                        '@' +
                        req.active_user.account +
                        ' just added: @' +
                        req.body.account +
                        ' to team as: ' +
                        req.body.about,
                    created: Date.now(),
                });

                await newActivity.save();

                res.status(200).send('sucessfully added team');
            }
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });

    app.post('/api/private/office/team/remove', async function(req, res) {
        try {
            var newTeam = await team.updateOne(
                {
                    account: req.body.account,
                    role: { $nin: ['owner', 'super_admin'] },
                },
                { $set: { state: 'active' } }
            );

            //update site activity
            var newActivity = activity({
                title: 'Team member relieved',
                slug_id: '/team/' + req.body.account,
                action: 'remove',
                type: 'team',
                source: 'report',
                account: req.active_user.account,
                description:
                    '@' +
                    req.active_user.account +
                    ' just removed: @' +
                    req.body.account +
                    ' from team as: ' +
                    req.body.about,
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
