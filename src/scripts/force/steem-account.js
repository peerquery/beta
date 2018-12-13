'use strict';

var membership = require('../models/membership');
var project = require('../models/project');
//do not worry about sanitizing req.body; already done in the server!

module.exports = async function() {
    try {
        //use lean() so as to get a javascript JSON object
        var memberships = await membership
            .find({ steem: null })
            .lean()
            .select('identifier slug_id');

        //console.log(memberships)

        var results = await Promise.all(
            memberships.map(async member_ship => {
                //console.log(membership)

                //project
                var pj = await project
                    .findOne({ slug_id: member_ship.slug_id })
                    .lean()
                    .select('steem owner');

                if (!pj) return;
                if (!pj.steem) return;
                if (!pj.owner) return;

                var res = await membership.findOneAndUpdate(
                    { identifier: member_ship.identifier },
                    { $set: { steem: pj.steem || pj.owner } }
                );
                //console.log(res)
            })
        );

        if (results) {
            console.log('successfully force set steem accounts');

            return true;
        } else {
            console.log('falied to force set steem');
            return false;
        }
    } catch (err) {
        console.log(err.message);

        return false;
    }
};
