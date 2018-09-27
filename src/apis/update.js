'use strict';

var shortid = require('shortid'),
    createDOMPurify = require('dompurify'),
    { JSDOM } = require('jsdom'),
    window = new JSDOM('').window,
    DOMPurify = createDOMPurify(window),
    mongoose = require('mongoose'),
    activity = require('../models/activity'),
    project = require('../models/project');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.post('/api/private/update/project', async function(req, res) {
        try {
            var story = await DOMPurify.sanitize(req.body.story, {
                SAFE_FOR_JQUERY: true,
            });

            var newProject = {
                name: req.body.name,
                slug: req.body.slug,
                location: req.body.location,
                logo: req.body.logo,
                cover: req.body.cover,
                description: req.body.description,
                mission: req.body.mission,
                story: story,
                state: req.body.state,
                tag: req.body.tag,
                website: req.body.website,
                steem: req.body.steem,
                facebook: req.body.facebook,
                twitter: req.body.twitter,
                github: req.body.github,
                chat: req.body.chat,
                last_update: new Date(),
            };

            var newActivity = activity({
                title: 'Update to: ' + req.body.name,
                slug: '/project/' + req.body.slug,
                action: 'update',
                type: 'project',
                description:
                    '@' +
                    req.active_user.account +
                    ' just updated their project: ' +
                    req.body.name,
                created: Date.now(),
            });

            //var query = { slug: req.body.slug, owner: req.active_user.account };

            var query = { slug: req.body.slug, owner: req.active_user.account };

            var options = { new: true };

            var _status = await project.findOneAndUpdate(
                query,
                newProject,
                options
            );

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
