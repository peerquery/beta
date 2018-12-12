'use strict';

var project = require('../../models/project');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.post('/api/private/project/compliments/welcome_message', async function(
        req,
        res
    ) {
        try {
            let update = {
                $set: {
                    new_member_message_title: req.body.title,
                    new_member_message_body: req.body.body,
                },
            };
            let query = { slug_id: req.body.slug_id };

            await project.updateOne(query, update);

            res.status(200).send('success');
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.post(
        '/api/private/project/compliments/benefactor_message',
        async function(req, res) {
            try {
                let update = {
                    $set: {
                        new_benefactor_message_title: req.body.title,
                        new_benefactor_message_body: req.body.body,
                    },
                };
                let query = { slug_id: req.body.slug_id };

                await project.updateOne(query, update);

                res.status(200).send('success');
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        }
    );

    app.get('/api/private/project/:slug_id/compliments', async function(
        req,
        res
    ) {
        try {
            let get =
                'new_member_message_title new_member_message_body new_benefactor_message_title new_benefactor_message_body ';
            let query = { slug_id: req.params.slug_id };

            var results = await project.findOne(query).select(get);

            res.status(200).json(results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
};
