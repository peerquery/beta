'use strict';

const global_config = require('./globals');
//console.log(global_config());

const voter_bot = require('./voter-bot');
const curation_voter = require('./curation-voter');
const curator_voter = require('./curator-voter');
const team_project_voter = require('./team-project-voter');
const today = require('../lib/helpers/day');

module.exports = async function(app) {
    //main timer which only runs every 24 hours and calls or shuts(on bot rest day) all other timers
    setInterval(async function() {
        if (
            today.toLowerCase() == (await global_config().curation_rest_day1) ||
            today.toLowerCase() == (await global_config().curation_rest_day2)
        ) {
            clearInterval(curation_voter_timer);
        } else {
            try {
                //first clear the timer and then reset it
                clearInterval(curation_voter_timer);
                curation_voter_timer();

                //these are not timers, just functions that run every 24 hours
                voter_bot(curator_voter(await global_config()));
                voter_bot(team_project_voter(await global_config()));
            } catch (err) {
                console.log(err);
            }
        }
    }, 1440 * 60 * 1000); //24 hours

    //vote curation
    var curation_interval =
        (await global_config().curation_vote_interval_minutes) * 60 * 60 * 1000;
    var curation_voter_timer = setInterval(async function() {
        try {
            voter_bot(curation_voter(await global_config()));
        } catch (err) {
            console.log(err);
        }
    }, curation_interval);

    console.log('\n\n\n    > voting bot activated!');
};
