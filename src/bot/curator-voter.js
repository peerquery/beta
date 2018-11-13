'use strict';

var activity = require('../models/activity');

const config = require('../configs/config');
const dsteem = require('dsteem');
const client = new dsteem.Client(config.steem_rpc);

module.exports = async function(global_settings) {
    var actions = 'vote';

    //fetch team accounts including *project blog* but excluding *curators* and those *inactive*

    var results = await activity.collection.aggregate([
        {
            $match: {
                type: 'curation',
                created: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            },
        },
        { $group: { _id: '$account', count: { $sum: 1 } } },
    ]);

    //console.log('-----db results: ', results);
    if (!results || results == '') return;

    for (var x in results) {
        var acc = results[x].account;
        var data = {};

        //set universal variables
        data.author = acc;
        data.voter = global_settings.curation_bot_account;

        //get one latest post from the author's blog
        //the function returns posts by author and re-steemed posts by author so we fetch the last 5 posts
        var posts = await client.database.getDiscussions('blog', {
            tag: acc,
            limit: 5,
        });
        //console.log(posts)

        //and we filter to get the last one authored by the user
        var blog = function(posts) {
            for (var i in posts) {
                if (posts[i].author == acc) return posts[i];
            }
        };

        var post = blog(posts);
        data.permlink = post.permlink;

        //calculate the vote worth for each curator based on their curation count
        //then we multiple by 100 since we used curator rate is based on %(100) instead the true 10,000 for 100% weight
        data.weight =
            results[x].count * global_settings.curation_curator_rate * 100;

        return {
            data: data,
            actions: actions,
            type: 'curators',
            config: global_settings,
        };
    }
};
