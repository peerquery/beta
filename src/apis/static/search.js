'use strict';

var queries = require('../../models/query');
var reports = require('../../models/report');
var projects = require('../../models/project');
var stats = require('../../models/stats');
var searches = require('../../models/search');

module.exports = async function(app) {
    app.post('/api/fetch/search/reports/:last_id', async function(req, res) {
        try {
            let query = 'author permlink title created summary ';
            let results;

            if (req.params.last_id == 0) {
                //use .lean() to get JSOn object which could be modified, not mongoose un-modifiable document

                results = await reports
                    .find({ title: { $regex: req.body.query, $options: 'i' } })
                    .lean()
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
            } else {
                //use .lean() to get JSOn object which could be modified, not mongoose un-modifiable document

                results = await reports
                    .find({
                        title: { $regex: req.body.query, $options: 'i' },
                        _id: { $gt: req.params.last_id },
                    })
                    .lean()
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
            }

            //update stats and records
            let user = '';
            if (req.active_user) user = req.active_user.account;

            var newSearch = searches({
                query: req.body.query,
                author: user,
                type: req.body.type,
                created: new Date(),
            });

            await newSearch.save();

            await stats.updateOne(
                { identifier: 'default' },
                { $inc: { search_count: 1 } }
            );

            //now prepare results
            var new_results = results.map(result => {
                result.account = result.author;
                result.type = 'report';

                return result;
            });

            res.status(200).json(new_results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.post('/api/fetch/search/queries/:last_id', async function(req, res) {
        try {
            let query = 'author permlink title created description ';
            let results;

            if (req.params.last_id == 0) {
                //use .lean() to get JSOn object which could be modified, not mongoose un-modifiable document

                results = await queries
                    .find({ title: { $regex: req.body.query, $options: 'i' } })
                    .lean()
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
            } else {
                //use .lean() to get JSOn object which could be modified, not mongoose un-modifiable document

                results = await reports
                    .find({
                        title: { $regex: req.body.query, $options: 'i' },
                        _id: { $gt: req.params.last_id },
                    })
                    .lean()
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
            }

            //update stats and records

            let user = '';
            if (req.active_user) user = req.active_user.account;

            var newSearch = searches({
                query: req.body.query,
                author: user,
                type: req.body.type,
                created: new Date(),
            });

            await newSearch.save();

            await stats.updateOne(
                { identifier: 'default' },
                { $inc: { search_count: 1 } }
            );

            //now prepare results
            var new_results = results.map(result => {
                result.account = result.author;
                result.summary = result.description;
                result.type = 'query';

                return result;
            });

            res.status(200).json(new_results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    app.post('/api/fetch/search/projects/:last_id', async function(req, res) {
        try {
            let query = 'owner slug_id name created description ';
            let results;

            if (req.params.last_id == 0) {
                //use .lean() to get JSOn object which could be modified, not mongoose un-modifiable document
                results = await projects
                    .find({ name: { $regex: req.body.query, $options: 'i' } })
                    .lean()
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
            } else {
                //use .lean() to get JSOn object which could be modified, not mongoose un-modifiable document

                results = await reports
                    .find({
                        name: { $regex: req.body.query, $options: 'i' },
                        _id: { $gt: req.params.last_id },
                    })
                    .lean()
                    .select(query)
                    .limit(20)
                    .sort({ created: -1 });
            }

            //update stats and records
            let user = '';
            if (req.active_user) user = req.active_user.account;

            var newSearch = searches({
                query: req.body.query,
                author: user,
                type: req.body.type,
                created: new Date(),
            });

            await newSearch.save();

            await stats.updateOne(
                { identifier: 'default' },
                { $inc: { search_count: 1 } }
            );

            //now prepare records
            var new_results = results.map(result => {
                result.title = result.name;
                result.account = result.owner;
                result.permlink = result.slug_id;
                result.summary = result.description;
                result.type = 'project';

                return result;
            });

            res.status(200).json(new_results);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
};
