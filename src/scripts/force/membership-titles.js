'use strict';

var membership = require('../../models/membership');
//do not worry about sanitizing req.body; already done in the server!

module.exports = async function() {
    try {
        //use lean() so as to get a javascript JSON object
        var memberships = await membership
            .find({})
            .lean()
            .select('title name identifier');

        //console.log(memberships);

        let updates = [];

        var results = await Promise.all(
            memberships.map(async function(member_ship) {
                //console.log(membership)

                if (!member_ship.title)
                    await membership.updateOne(
                        { identifier: member_ship.identifier },
                        { $set: { title: member_ship.name } }
                    );
            })
        );

        if (results) {
            console.log('successfully force set titles');

            return true;
        } else {
            console.log('falied to force set titles');
            return false;
        }
    } catch (err) {
        console.log(err.message);

        return false;
    }
};
