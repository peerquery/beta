'use strict';

var activity = require('../../models/activity'),
    project = require('../../models/project');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.post('/api/private/update/project', async function(req, res) {
        try {
            var update = {
                name: req.body.name,
                slug: req.body.slug,
                location: req.body.location,
                logo: req.body.logo,
                cover: req.body.cover,
                description: req.body.description,
                mission: req.body.mission,
                story: req.body.story,
                state: req.body.state,
                tag: req.body.tag,
                website: req.body.website,
                facebook: req.body.facebook,
                twitter: req.body.twitter,
                github: req.body.github,
                chat: req.body.chat,
                last_update: new Date(),
            };

            var newActivity = activity({
                slug: req.body.slug,
                action: 'update_project',
                account: req.active_user.user,
                created: Date.now(),
            });

            //var query = { slug: req.body.slug, owner: req.active_user.account };

            var query = { slug: req.body.slug, owner: req.active_user.account };

            var _status = await project.updateOne(query, update);

            if (!_status)
                return res
                    .status(500)
                    .send('sorry, could not create project. please try again');

            await newActivity.save();

            res.status(200).send(req.body.slug);
        } catch (err) {
            res.status(500).send(
                'sorry, could not create project. please try again'
            );
            console.log(err);
        }
    });
};
