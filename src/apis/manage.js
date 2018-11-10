'use strict';

var project = require('../models/project');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.post('/api/private/update/project/project_theme', async function(
        req,
        res
    ) {
        try {
            var query = {
                slug_id: req.body.slug_id,
                owner: req.active_user.account,
            };

            var update = {
                $set: {
                    type: req.body.type,
                    color: req.body.color,
                },
            };

            var _status = await project.updateOne(query, update, {
                upsert: true,
                setDefaultsOnInsert: true,
            });

            if (!_status) return res.sendStatus(500);

            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    });

    app.post('/api/private/update/project/action_button', async function(
        req,
        res
    ) {
        try {
            var query = {
                slug_id: req.body.slug_id,
                owner: req.active_user.account,
            };

            var update = {
                $set: {
                    act_msg: req.body.msg,
                    act_uri: req.body.uri,
                },
            };

            var _status = await project.updateOne(query, update, {
                upsert: true,
                setDefaultsOnInsert: true,
            });

            if (!_status) return res.sendStatus(500);

            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    });
};
