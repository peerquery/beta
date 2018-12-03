'use strict';

var activity = require('../../models/activity'),
    peer = require('../../models/peer');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.post('/api/private/user/settings/update', async function(req, res) {
        try {
            let update = {};

            if (req.body.type == 'hiring') {
                update = { $set: { hiring: req.body.value } };
            } else if (req.body.type == 'messaging') {
                update = { $set: { messaging: req.body.value } };
            }

            var query = { account: req.active_user.account };

            var _status = await peer.updateOne(query, update);

            if (!_status)
                return res
                    .status(500)
                    .send('sorry, could not update peer. please try again');

            var newActivity = activity({
                title: 'Update to: ' + req.body.type,
                slug: '/peer/' + req.active_user.account,
                action: 'update',
                type: 'user',
                account: req.active_user.account,
                description:
                    '@' +
                    req.active_user.account +
                    ' just updated their ' +
                    req.body.type,
                created: Date.now(),
            });

            await newActivity.save();

            res.status(200).send(req.body.slug);
        } catch (err) {
            res.status(500).send(
                'sorry, could not update peer. please try again'
            );
            console.log(err);
        }
    });
};
