
'use strict';

var mongoose = require('mongoose'),
    activity = require('../models/activity');
    //do not worry about sanitizing req.body; already done in the server!
    
module.exports = function (app) {
    
    app.get('/api/test', async function (req, res) {
        res.status(200).send('success');
    });
    
    app.post('/api/private/test', async function (req, res) {
        res.status(401).send('No permission');
    });
    
    app.get('/api/test/data', async function (req, res) {
        try {
            let results = await activity.findOne().select('type') || {sample: 'test'};
            res.status(200).json(results);
        } catch (err){
            res.status(500).send('sorry, could get project. please try again');
            console.log(err);
        }
    });
    
};

