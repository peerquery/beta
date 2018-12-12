'use strict';

const peer = require('../../models/peer');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.post('/api/private/settings/update/benefactor_message', async function(
        req,
        res
    ) {
        try {
            let update = {
                $set: {
                    new_benefactor_message_title: req.body.title,
                    new_benefactor_message_body: req.body.body,
                },
            };
            let query = { account: req.active_user.account };

            await peer.updateOne(query, update);

            res.status(200).send('success');
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
};
