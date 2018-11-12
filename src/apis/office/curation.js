'use strict';

var report = require('../../models/report'),
    activity = require('../../models/activity'),
    peer = require('../../models/peer'),
    stats = require('../../models/stats'),
    settings = require('../../models/settings'),
    team = require('../../models/team'),
    day = require('../../lib/helpers/day');
//do not worry about sanitizing req.body; already done in the server!

module.exports = function(app) {
    app.post('/api/private/office/curation/approve', async function(req, res) {
        try {
            //get post data to see if post curation already exist
            var report_query = { permlink: req.body.permlink };
            var exists = await report
                .findOne(report_query)
                .select('curation_time -_id');

            //update post
            var query = { _id: req.body._id };
            var update = {
                $set: {
                    curation_curator: req.active_user.account,
                    curation_state: 2,
                    curation_remarks: req.body.curation_remarks,
                    curation_rate: req.body.rate,
                    curation_time: new Date(),
                },
            };

            await report.updateOne(query, update);

            //update site activity
            var newActivity = activity({
                title: req.body.title,
                slug_id: '/@' + req.body.author + '/' + req.body.permlink,
                action: req.body.action,
                type: 'curation',
                source: 'report',
                account: req.active_user.account,
                description:
                    'curator @' +
                    req.active_user.account +
                    ' just approved: ' +
                    req.body.title,
                created: Date.now(),
                value: Number(req.body.rate),
            });

            await newActivity.save();

            if (!exists.curation_time) {
                //first time curation

                //update author's curation stats
                var updatePeer = {
                    $inc: {
                        curation_points: Number(req.body.rate),
                        curation_approves: 1,
                    },
                };
                await peer.updateOne({ account: req.body.author }, updatePeer);

                //increase curation count for site
                var updateStats = {
                    $inc: { curations_count: 1 },
                };
                await stats.updateOne({ identifier: 'default' }, updateStats);

                //increase curation count for curator
                let updateCurator = {
                    $inc: {
                        curation_count: 1,
                        curation_points_total: Number(req.body.rate),
                        curation_approvals_count: 1,
                    },
                };
                await team.updateOne(
                    { account: req.active_user.account },
                    updateCurator
                );
            } else {
                //post has already been previously rejected, this time it is being re-approved

                //update author's curation stats
                let updatePeer = {
                    $inc: {
                        curation_points: Number(req.body.rate),
                        curation_rejects: -1,
                        curation_approves: 1,
                    },
                };

                await peer.updateOne({ account: req.body.author }, updatePeer);
            }

            res.status(200).send('sucessfully curated post');
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });

    app.post('/api/private/office/curation/reject', async function(req, res) {
        try {
            //get post data to see if post curation already exist
            var report_query = { permlink: req.body.permlink };
            var exists = await report
                .findOne(report_query)
                .select('curation_time -_id');

            //update post
            var query = { _id: req.body._id };
            var update = {
                $set: {
                    curation_curator: req.active_user.account,
                    curation_state: -1,
                    curation_remarks: req.body.curation_remarks,
                    curation_time: new Date(),
                },
            };

            await report.updateOne(query, update);

            //update site activity
            var newActivity = activity({
                title: req.body.title,
                slug_id: '/@' + req.body.author + '/' + req.body.permlink,
                action: req.body.action,
                type: 'curation',
                source: 'report',
                account: req.active_user.account,
                description:
                    'curator @' +
                    req.active_user.account +
                    ' just rejected: ' +
                    req.body.title,
                created: Date.now(),
            });

            await newActivity.save();

            if (!exists.curation_time) {
                //first time curation

                //update author's curation stats
                var updatePeer = {
                    $inc: { curation_rejects: 1 },
                };
                await peer.updateOne({ account: req.body.author }, updatePeer);

                //increase curation count for site
                var updateStats = {
                    $inc: { curations_count: 1 },
                };
                await stats.updateOne({ identifier: 'default' }, updateStats);

                //increase curation count for curator
                let updateCurator = {
                    $inc: { curation_count: 1, curation_rejections_count: 1 },
                };
                await team.updateOne(
                    { account: req.active_user.account },
                    updateCurator
                );
            } else {
                //post has already been previously approved, this time it is being re-rejected

                //update author's curation stats
                let updatePeer = {
                    $inc: { curation_rejects: 1, curation_approves: -1 },
                };

                await peer.updateOne({ account: req.body.author }, updatePeer);
            }

            res.status(200).send('sucessfully curated post');
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });

    app.get('/api/private/office/curation/curate', async function(req, res) {
        try {
            //we need to use native Mongo client here, not Mongoose
            //var data = await report.findOneAndUpdate(find, update, options);
            //will not work because Mongoose will cast date type to `new Date(...)`
            //which is not ISO date format used in Mongo so query will not work
            //so we by cast the un-stoppable Mongoose date casting due to scheme type by using the native Mongo DB driver

            var one_day_ago = new Date(Date.now() - 24 * 60 * 60 * 1000);

            var count = await activity.collection
                .find({ type: 'curation', created: { $gt: one_day_ago } })
                .count();

            var setting = await settings
                .findOne({ identifier: 'default' })
                .select(
                    'curation_rest_day1 curation_rest_day2 curation_daily_limit _id'
                );
            var today = day().toLowerCase();

            setting.curation_rest_day1 = setting.curation_rest_day1.trim();
            setting.curation_rest_day2 = setting.curation_rest_day2.trim();

            //verify that day is not rest day for curation
            if (
                today === setting.curation_rest_day1 ||
                today === setting.curation_rest_day2
            ) {
                return res
                    .status(405)
                    .send('sorry, today is rest day for curation');
            } else if (count === setting.curation_daily_limit) {
                //verify that curation limit is not exceeded

                return res
                    .status(405)
                    .send(
                        'sorry, curation limit reached for today. please try again tommorrow'
                    );
            } else {
                var five_days_ago = new Date(
                    Date.now() - 5 * 24 * 60 * 60 * 1000
                ).toISOString();

                var query = {
                    curation_state: 0,
                    created: { $gt: five_days_ago },
                }; //only posts within last 5 days
                var update = {
                    $inc: { curation_state: 1 },
                    $set: {
                        curation_curator: req.active_user.account,
                        curation_time: new Date(),
                    },
                };
                var options = {
                    fields: {
                        author: 1,
                        permlink: 1,
                        title: 1,
                        created: 1,
                        body: 1,
                        curation_curator: 1,
                        curation_rate: 1,
                    },
                };

                //we need to use native Mongo client here, not Mongoose
                //var data = await report.findOneAndUpdate(find, update, options);
                //will not work because Mongoose will cast date type to `new Date(...)`
                //which is not ISO date format used in Mongo so query will not work
                //so we by cast the un-stoppable Mongoose date casting due to scheme type by using the native Mongo DB driver
                /*
            //cheat sheet
            
            var cursor = await report.collection.find({ curation_state: 0, created: { $gt: five_days_ago } }).limit(1) 
            var data = await cursor.toArray();
            
            */

                var cursor = await report.collection.findOneAndUpdate(
                    query,
                    update,
                    options
                );

                var data = cursor.value;

                if (!data)
                    return res
                        .status(404)
                        .send(
                            'sorry, could not get curate data. please try again'
                        );

                //this section comes after the above section, since somethings data is NULL
                data.percent =
                    '(' + count + '/' + setting.curation_daily_limit + ')';

                res.status(200).json(data);
            }
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });

    app.get('/api/private/office/curation/approved', async function(req, res) {
        try {
            var five_days_ago = new Date(
                Date.now() - 5 * 24 * 60 * 60 * 1000
            ).toISOString();

            var query = { curation_state: 2, created: { $gt: five_days_ago } }; //only posts within last 5 days
            var options = {
                fields: {
                    author: 1,
                    permlink: 1,
                    title: 1,
                    created: 1,
                    body: 1,
                    curation_curator: 1,
                    curation_rate: 1,
                },
            };

            //we need to use native Mongo client here, not Mongoose
            //var data = await report.findOneAndUpdate(find, update, options);
            //will not work because Mongoose will cast date type to `new Date(...)`
            //which is not ISO date format used in Mongo so query will not work
            //so we by cast the un-stoppable Mongoose date casting due to scheme type by using the native Mongo DB driver

            var cursor = await report.collection.find(query, options).limit(20);
            var data = await cursor.toArray();

            if (!data)
                return res
                    .status(404)
                    .send('sorry, could not get curate data. please try again');

            res.status(200).json(data);
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });

    app.get('/api/private/office/curation/ignored', async function(req, res) {
        try {
            var five_days_ago = new Date(
                Date.now() - 5 * 24 * 60 * 60 * 1000
            ).toISOString();
            var one_day_ago = new Date(
                Date.now() - 24 * 60 * 60 * 1000
            ).toISOString();

            //only posts within last 5 days that are seen but not curated after 24 hours
            var query = {
                curation_state: 1,
                created: { $gt: five_days_ago, $lt: one_day_ago },
            };
            var options = {
                fields: {
                    author: 1,
                    permlink: 1,
                    title: 1,
                    created: 1,
                    body: 1,
                    curation_curator: 1,
                    curation_rate: 1,
                },
            };

            //we need to use native Mongo client here, not Mongoose
            //var data = await report.findOneAndUpdate(find, update, options);
            //will not work because Mongoose will cast date type to `new Date(...)`
            //which is not ISO date format used in Mongo so query will not work
            //so we by cast the un-stoppable Mongoose date casting due to scheme type by using the native Mongo DB driver

            var cursor = await report.collection.find(query, options).limit(20);
            var data = await cursor.toArray();

            if (!data)
                return res
                    .status(404)
                    .send('sorry, could not get curate data. please try again');

            res.status(200).json(data);
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });

    app.get('/api/private/office/curation/lost', async function(req, res) {
        try {
            var five_days_ago = new Date(
                Date.now() - 5 * 24 * 60 * 60 * 1000
            ).toISOString();
            var one_day_ago = new Date(
                Date.now() - 24 * 60 * 60 * 1000
            ).toISOString();

            //only posts within last 5 days that are not seen after 24 hours
            var query = {
                curation_state: 0,
                created: { $gt: five_days_ago, $lt: one_day_ago },
            };
            var options = {
                fields: {
                    author: 1,
                    permlink: 1,
                    title: 1,
                    created: 1,
                    body: 1,
                    curation_curator: 1,
                    curation_rate: 1,
                },
            };

            //we need to use native Mongo client here, not Mongoose
            //var data = await report.findOneAndUpdate(find, update, options);
            //will not work because Mongoose will cast date type to `new Date(...)`
            //which is not ISO date format used in Mongo so query will not work
            //so we by cast the un-stoppable Mongoose date casting due to scheme type by using the native Mongo DB driver

            var cursor = await report.collection.find(query, options).limit(20);
            var data = await cursor.toArray();

            if (!data)
                return res
                    .status(404)
                    .send('sorry, could not get curate data. please try again');

            res.status(200).json(data);
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });

    app.get('/api/private/office/curation/rejected', async function(req, res) {
        try {
            var five_days_ago = new Date(
                Date.now() - 5 * 24 * 60 * 60 * 1000
            ).toISOString();

            var query = { curation_state: -1, created: { $gt: five_days_ago } }; //only posts within last 5 days that are rejected
            var options = {
                fields: {
                    author: 1,
                    permlink: 1,
                    title: 1,
                    created: 1,
                    body: 1,
                    curation_curator: 1,
                    curation_rate: 1,
                },
            };

            //we need to use native Mongo client here, not Mongoose
            //var data = await report.findOneAndUpdate(find, update, options);
            //will not work because Mongoose will cast date type to `new Date(...)`
            //which is not ISO date format used in Mongo so query will not work
            //so we by cast the un-stoppable Mongoose date casting due to scheme type by using the native Mongo DB driver

            var cursor = await report.collection.find(query, options).limit(20);
            var data = await cursor.toArray();

            if (!data)
                return res
                    .status(404)
                    .send('sorry, could not get curate data. please try again');

            res.status(200).json(data);
        } catch (err) {
            res.status(500).send('sorry, an err occured. please try again');
            console.log(err);
        }
    });
};
