'use strict';

var settings = require('../models/settings'),
    team = require('../models/team');

module.exports = async function(app) {
    try {
        //
        //set the site's basic details
        //

        //static id - to ensure there is always only one 'settings' document
        var settings_query = { identifier: 'default' };

        var updateSettings = {
            //static id - to ensure there is always only one 'settings' document
            identifier: 'default',

            //meta
            name: 'Peer Query',
            description: 'Peer to peer collaborations site powered by Steem',

            //basic team
            owner: 'peerquery',
            admin: 'dzivenu',

            //uris
            domain: 'https://www.peerquery.com',
            steem: 'peerquery',

            update_update: new Date(),
        };

        var settings_options = { upsert: true };

        var settings_status = await settings.updateOne(
            settings_query,
            updateSettings,
            settings_options
        );

        //
        //now set the owner
        //

        var team_query1 = { account: 'peerquery' };

        var updateTeam1 = {
            name: 'Peer Query',
            account: 'peerquery',
            role: 'owner',
        };

        var team_options1 = { upsert: true };

        var team_status1 = await team.updateOne(
            team_query1,
            updateTeam1,
            team_options1
        );

        //
        //now set the admin
        //

        var team_query2 = { account: 'dzivenu' };

        var updateTeam2 = {
            name: 'Makafui George Dzivenu',
            account: 'dzivenu',
            role: 'admin',
        };

        var team_options2 = { upsert: true };

        var team_status2 = await team.updateOne(
            team_query2,
            updateTeam2,
            team_options2
        );

        /*
            //concise version, but only good at generating errors and wasting time
            
            var updateOwner = {
                
                name: "Peer Query",
                account: "peerquery",
                role: 'owner'
                
            };

            var updateAdmin = {
                
                name: "Makafui George Dzivenu",
                account: "dzivenu",
                role: 'admin'
                
            };
            
            var options = { continueOnError: true, safe: true, ordered: false };
            
            console.log([ updateOwner, updateAdmin ])
            
            var team_status = await team.insertMany( [ updateOwner, updateAdmin ], options );
            console.log(team_status)
            
            */

        console.log('\n\n\nDB setup successful, starting server... ');

        return true;
    } catch (err) {
        console.log(err);
    }
};
