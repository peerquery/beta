'use strict';

var message = require('../../models/message');
var peer = require('../../models/peer');

module.exports = async function(app) {
    app.get('/api/peer/messages/:last_id', async function(req, res) {
        try {
            let query = 'author title slug_id created state';
            let options;

            if (req.params.last_id == 0) {
                options = {
                    target: 'user',
                    recipient: req.active_user.account,
                };
            } else {
                options = {
                    target: 'user',
                    recipient: req.active_user.account,
                    _id: { $gt: req.params.last_id },
                };
            }

            let results = await message
                .find(options)
                .select(query)
                .limit(20)
                .sort({ created: -1 });

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.get('/api/peer/message/:slug_id', async function(req, res) {
        try {
            let query = 'author title body slug_id created state';
            let options = { slug_id: req.params.slug_id };
            let update = { $set: { state: 'read' } };

            let results = await message
                .findOneAndUpdate(options, update)
                .select(query);

            //do NOT return new updated document. return old document
            //if the post was already 'read', then do not increment the viewed_messages count
            //else then it is the first time read, so increment it!

            if (results && results.state !== 'read')
                await peer.updateOne(
                    { account: req.active_user.account },
                    { $inc: { viewed_messages: 1 } }
                );

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
};
