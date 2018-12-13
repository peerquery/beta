'use strict';

var activity = require('../../models/activity'),
    membership = require('../../models/membership'),
    project = require('../../models/project'),
    peer = require('../../models/peer');
//do not worry about sanitizing req.body; already done in the server!

module.exports = async function() {
    try {
        var memberships = await peer
            .find({})
            .lean()
            .select('account memberships');

        //console.log(memberships);

        let updates = [];

        var results = await Promise.all(
            memberships.map(async function(member_ship) {
                if (!member_ship.memberships) return;

                //console.log(member_ship)

                let account = member_ship.account;

                //console.log(member_ship.memberships)

                for (let x in member_ship.memberships) {
                    let pj = member_ship.memberships[x];
                    //console.log(pj);

                    if (!pj) continue;

                    var data = await project
                        .findOne({ slug_id: pj.slug_id })
                        .lean()
                        .select('name title steem owner slug_id');

                    if (!data) continue;

                    //console.log(data);

                    let membership_updated = await peer
                        .findOneAndUpdate(
                            {
                                account: account,
                                'memberships.slug_id': pj.slug_id,
                            },
                            {
                                $set: {
                                    'memberships.$._id': data._id,
                                    'memberships.$.title': data.title,
                                    'memberships.$.steem':
                                        data.steem || data.owner,
                                },
                            }
                        )
                        .select('memberships');

                    //console.log(membership_updated);
                }
            })
        );

        if (results) {
            console.log('done with migrate update');

            return true;
        } else {
            console.log(results);
            console.log('failed to migrate db');
            return false;
        }
    } catch (err) {
        console.log(err);

        return false;
    }
};
