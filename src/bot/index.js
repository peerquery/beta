'use strict';

const global_config = require('./globals');
//console.log(await global_config());

var activity = require('../models/activity');

const voter_bot = require('./voter-bot');
const curation_voter = require('./curation-voter');
const curator_voter = require('./curator-voter');
const team_project_voter = require('./team-project-voter');
const today = require('../lib/helpers/day');

module.exports = async function(app) {
    var curation_voter_timer;

    //main timer which only runs every 24 hours and calls or shuts(on bot rest day) all other timers
    setInterval(async function() {
        //no need make this dynamically updatable, since its used once a day, reset every day by the setInterval within which it dwells
        //also, for where its needed dynamically(curatiion_voter_timer), it is called lively as *await global_config()* not as *config*
        var config = await global_config();

        if (
            today().toLowerCase() == config.curation_rest_day1 ||
            today().toLowerCase() == config.curation_rest_day2
        ) {
            clearInterval(curation_voter_timer);
        } else {
            try {
                //if not rest day, then set timer for curation
                var curation_interval =
                    config.curation_vote_interval_minutes * 60 * 1000;
                //console.log(curation_interval)

                curation_voter_timer = setInterval(async function() {
                    voter_bot(await curation_voter(await global_config()));
                }, curation_interval);

                var newActivity = {
                    title:
                        'Project and team members compensated for today from: ' +
                        new Date(),
                    slug_id: new Date().toDateString() + '_team_project_voted',
                    action: 'pay',
                    type: 'vote',
                    source: 'bot',
                    account: config.curation_bot_account,
                    description:
                        'Project and team members compensated for today!',
                    created: Date.now(),
                };

                //see if details exists, else set them. set the fact that the team are bing paid for today
                var results = await activity.findOneAndUpdate(
                    {
                        slug_id:
                            new Date().toDateString() + '_team_project_voted',
                    },
                    { $setOnInsert: newActivity },
                    { upsert: true }
                );

                if (results) return;

                //this is critically important. it will ensure that when in cluster mode or running
                //multiple instances, no two server spawns will run this code twice
                //hence no duplicate voting of project and team

                //these are not timers, just functions that run every 24 hours

                //curators data
                var curator_data = voter_bot(await curator_voter(config));

                if (curator_data)
                    for (let x in curator_data) {
                        voter_bot(curator_data[x]);
                    }

                //team and project data
                var team_project_data = voter_bot(
                    await team_project_voter(config)
                );

                if (team_project_data)
                    for (let x in team_project_data) {
                        voter_bot(team_project_data[x]);
                    }
            } catch (err) {
                console.log(err);
            }
        }
    }, 24 * 60 * 60 * 1000); //24 hours

    console.log('\n\n\n    > voting bot activated!');
};
