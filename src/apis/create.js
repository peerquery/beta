
'use strict';

var shortid = require('shortid'),
    mongoose = require('mongoose'),
    parser = require('../lib/post-parser-node'),
    activity = require('../models/activity'),
    peer = require('../models/peer'),
    report = require('../models/report'),
    query = require('../models/query'),
    project = require('../models/project');
//do not worry about sanitizing req.body; already done in the server!
    
module.exports = function (app) {
    
    app.post('/api/private/create/report', async function (req, res) {
        
        try {
            
            var project_title = req.body.project_title;
            var project_slug_id = req.body.project_slug_id;
            
            var newReport = report({
                
                steemid: req.body.steemid,
                author: req.active_user.account,
                title: req.body.title,
                category: req.body.category,
                summary: parser.summary(req.body.body, 300),
                body: req.body.body,
                permlink: req.body.permlink,
                project_title: project_title,
                project_slug_id: project_slug_id,
                url: req.active_user.account + '/' + req.body.permlink,
                view_count: 1,
                created: new Date(),
                update_at: new Date()
                
            });
        
            var newActivity = activity({
                
                title: req.body.title,
                slug_id: '/@' + req.active_user.account + '/' + req.body.permlink,
                action: 'create',
                type: 'report',
                source: 'user',
                account: req.active_user.account,
                description: '@' + req.active_user.account + ' just published a new report: ' + req.body.title,
                created: Date.now()
                
            });
            
            var updatePeer = {
                
                $inc : {'report_count' : 1},
                badge: 'reporter',
                last_update: Date.now(),
                last_report: req.body.permlink
                
            };
        
            await newReport.save();
            await newActivity.save();
            await peer.findOneAndUpdate( {account: req.active_user.account}, updatePeer, {upsert: true} );    //returns query though
            
            if (project_slug_id !== null && project_slug_id !== undefined && project_title !== null && project_title !== undefined) {
            
                var updateProject = {
                
                    $inc : {'report_count' : 1},
                    last_update: Date.now()
                
                };
                
                var newQuery = {slug_id: project_slug_id, title: project_title, owner: req.active_user.account};
                await project.findOneAndUpdate( newQuery, updateProject, {upsert: true} );//returns query!?
            
            }
        
            res.status(200).send('success');
        
        } catch (err){
            
            res.status(500).send('sorry, could not create project. please try again');
            console.log(err);
            
        }
        
    });
    
    app.post('/api/private/create/query', async function (req, res) {
        
        try {
            
            var project_title = req.body.project_title;
            var project_slug_id = req.body.project_slug_id;
            
            var newQuery = query({
                
                steemid: req.body.steemid,
                author: req.active_user.account,
                title: req.body.title,
                category: req.body.category,
                summary: parser.summary(req.body.body, 300),
                body: req.body.body,
                permlink: req.body.permlink,
                project_title: project_title,
                project_slug_id: project_slug_id,
                url: req.active_user.account + '/' + req.body.permlink,
                view_count: 1,
                terms: req.body.terms,
                email: req.body.email,
                telephone: req.body.telephone,
                website: req.body.website,
                reward: req.body.reward,
                reward_form: req.body.reward_form,
                label: req.body.label,
                type: req.body.type,
                deadline: req.body.deadline,
                image: req.body.image,
                description: req.body.description,
                created: new Date(),
                update_at: new Date()
                
            });
        
            var newActivity = activity({
                
                title: req.body.title,
                slug_id: '/@' + req.active_user.account + '/' + req.body.permlink,
                action: 'create',
                type: 'query',
                source: 'user',
                account: req.active_user.account,
                description: '@' + req.active_user.account + ' just published a new query: ' + req.body.title,
                created: Date.now()
                
            });
            
            var updatePeer = {
                
                $inc : {'query_count' : 1},
                badge: 'querant',
                last_update: Date.now(),
                last_report: req.body.permlink
                
            };
            
            await newQuery.save();
            await newActivity.save();
            await peer.findOneAndUpdate( {account: req.active_user.account}, updatePeer, {upsert: true} );    //returns query though
            
            if (project_slug_id !== null && project_slug_id !== undefined && project_title !== null && project_title !== undefined) {
            
                var updateProject = {
                
                    $inc : {'query_count' : 1},
                    last_update: Date.now()
                
                };
                
                var projectQuery = {slug_id: project_slug_id, title: project_title, owner: req.active_user.account};
                await project.findOneAndUpdate( projectQuery, updateProject, {upsert: true} );//returns query!?
            
            }
        
            res.status(200).send('success');
        
        } catch (err){
            
            res.status(500).send('sorry, could not create project. please try again');
            console.log(err);
            
        }
        
    });
    
    app.post('/api/private/create/project', async function (req, res) {
        
        try {
            
            if (req.body.story.length / Math.pow(1024,1) > 10) throw new Error('Story size is larger than allowed');    //greater than 10kb)
            
            const slug = shortid.generate();
            
            var story = await parser.clean(req.body.story);
            
            var newProject = project({
                
                name: req.body.name,
                slug: slug,
                slug_id: slug,
                title: req.body.title.substring(0, 100),
                founder: req.active_user.account,
                owner: req.active_user.account,
                location: req.body.location,
                logo: req.body.logo,
                cover: req.body.cover,
                description: req.body.description.substring(0, 160),
                mission: req.body.mission.substring(0, 160),
                story: story,
                state: req.body.state,
                member_count: 1,
                report_count: 0,
                tag: req.body.tag,
                website: req.body.website,
                steem: req.body.steem,
                facebook: req.body.facebook,
                twitter: req.body.twitter,
                github: req.body.github,
                chat: req.body.chat,
                type: 'community',
                created: new Date(),
                last_update: new Date(),
                team: {
                    account: req.active_user.account,
                    role: 'owner',
                    created: new Date()
                },
                members: {
                    account: req.active_user.account,
                    created: new Date()
                }
                
            });
        
            var newActivity = activity({
                
                title: req.body.title,
                slug_id: '/project/' + slug,
                action: 'create',
                type: 'project',
                source: 'user',
                account: req.active_user.account,
                description: '@' + req.active_user.account + ' just created a new project: ' + req.body.name,
                created: Date.now()
                
            });
        
            var updatePeer = {
                
                $inc : {'project_count' : 1},
                badge: 'builder',
                last_update: Date.now(),
                last_project_slug_id: slug,
                last_project_title: req.body.title,
                $push: {projects: 
                    {
                        id: newProject._id,
                        title: req.body.title,
                        slug_id: slug,
                        created: new Date()
                    }
                }
                
            };
        
            await newProject.save();
            await peer.findOneAndUpdate( {account: req.active_user.account}, updatePeer, {upsert: true} );    //returns query though
            await newActivity.save();
            
            res.status(200).send(slug);
        
        } catch (err){
            
            res.status(500).send('sorry, could not create project. please try again');
            console.log(err);
            
        }
        
        
    });
    
};

