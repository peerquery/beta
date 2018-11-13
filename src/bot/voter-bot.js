'use strict';

const globals = require('./globals');
const vote_worth = require('../lib/helpers/vote-worth');

require('dotenv').config();

const dsteem = require('dsteem');
const config = require('../configs/config');
const client = new dsteem.Client(config.steem_rpc);

const key = dsteem.PrivateKey.fromString(process.env.BOT_POSTING_KEY);

var activity = require('../models/activity');
var reports = require('../models/report');
var peers = require('../models/peer');
var stats = require('../models/stats');

module.exports = async function(obj) {
    var data = obj.data;
    var actions = obj.actions;
    var type = obj.type;
    var global_settings = obj.global_settings;

    //set vote details
    var vote = {
        voter: data.voter,
        author: data.author,
        permlink: data.permlink,
        weight: data.weight,
    };
    //console.log(vote);

    //await the vote - unfortunately, if vote fails - the post has already been marked as voted
    var vote_results = await client.broadcast.vote(vote, key);
    //console.log(vote_results);

    if (actions == 'vote_comment') {
        //set comment details
        var comment = {
            author: data.user,
            title: '',
            body: data.body,
            json_metadata: data.json_metadata,
            parent_author: data.parent_author,
            parent_permlink: data.parent_permlink,
            permlink: data.new_permlink,
        };
        //console.log(comment);

        //comment
        try {
            var comment_results = await client.broadcast.comment(comment, key);
            //console.log(comment_results);
        } catch (e) {
            console.log(e);
        }
    }

    //calculate vote amount in $/USD
    var vote_amount = vote_worth(
        data.weight,
        global_settings.voting_power,
        global_settings.final_vest,
        global_settings.recent_claims,
        global_settings.reward_balance,
        global_settings.sbd_median_price
    );

    //record activity in db

    try {
        //update site activity
        var newActivity = activity({
            title: 'New post by @' + data.author + ' voted',
            slug_id: '/@' + data.author + '/' + data.permlink,
            action: actions,
            type: type,
            source: 'bot',
            account: data.user,
            description: 'New post by @' + data.author + ' voted',
            created: Date.now(),
            value: vote_amount,
        });

        await newActivity.save();

        //update site stats
        await stats.updateOne(
            { identifier: 'default' },
            { $inc: { curation_worth: vote_amount, bot_vote_count: 1 } }
        );

        //update report stats
        await reports.updateOne(
            { permlink: data.permlink },
            { $inc: { curation_worth: vote_amount } }
        );

        //update author stats
        await peers.updateOne(
            { account: data.author },
            { $inc: { curation_earnings: vote_amount, curation_votes: 1 } }
        );
    } catch (e) {
        console.log(e);
    }
};
