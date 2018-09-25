
'use strict';

var mongoose = require('mongoose'),
    activity = require('../models/activity');
    //do not worry about sanitizing req.body; already done in the server!
    
module.exports = function (app) {
    
    app.get('/api', function (req, res) {
        res.status(200).json('/get API functional');
    });
    
    app.post('/api', function (req, res) {
        res.status(200).json('/post API functional');
    });
    
    app.get('/api/test/data', async function (req, res) {
        try {
            let results = await activity.findOne().select('type');
            res.status(200).json(results);
        } catch (err){
            res.status(500).send('sorry, could get project. please try again');
            //console.log(err);
        }
    });
    
};
