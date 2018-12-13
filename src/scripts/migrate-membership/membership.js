'use strict';

var membership = require('../../models/membership'),
    project = require('../../models/project'),
    peer = require('../../models/peer');
//do not worry about sanitizing req.body; already done in the server!

module.exports = async function() {
    try {
        //use lean() so as to get a javascript JSON object
        var memberships = await peer
            .find({})
            .lean()
            .select('account memberships');

        //console.log(memberships);

        let updates = [];

        await Promise.all(
            memberships.map(async function(member_ship) {
                //console.log(member_ship)

                for (let x in member_ship.memberships) {
                    let update = {};
                    let pj = member_ship.memberships[x];

                    if (!pj) continue;

                    //console.log(pj);

                    //identifier

                    update.identifier = member_ship.account + '_' + pj.slug_id;

                    //project details
                    //update.project = pj._id;
                    update.name = pj.name || ''; //project title
                    update.title = pj.title || pj.name || ''; //project title
                    update.slug_id = pj.slug_id;
                    update.role = pj.role || '';
                    update.type = pj.type || '';
                    update.steem = pj.steem || '';

                    //user details
                    //update.peer = member_ship._id;
                    update.account = member_ship.account;

                    //other details
                    update.state = pj.state || 'active'; //active, inactive
                    update.created = pj.created || new Date();

                    updates.push(update);
                }
            })
        );

        //console.log(updates);

        //no more using this one liner version, since it cannot update existing documents
        //var results = await membership.insertMany(updates, {ordered: false});

        var results = await Promise.all(
            updates.map(async function(update) {
                await membership.updateOne(
                    { identifier: update.identifier },
                    update,
                    { upsert: true }
                );
            })
        );

        if (results) {
            console.log('successfully migrated memberships');
            return true;
        } else {
            console.log('failed to migrate memberships');
            return false;
        }
    } catch (err) {
        console.log(err.message);

        return false;
    }
};
