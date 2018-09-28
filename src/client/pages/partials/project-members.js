'use strict';

var dsteem = require('dsteem'),
    create = require('./../../../lib/content-creator'),
    config = require('./../../../configs/config'),
    client = new dsteem.Client(config.steem_api);

async function display() {
    try {
        $('#members-container').html('');
        $('#members-loader').show();

        var results = await Promise.resolve(
            $.get('/api/members/project/' + project_slug)
        );
        var members = results.members;

        $('#members-loader').hide();

        for (var x in members) {
            var member = await create.member(members[x]);
            $('#members-container').append(member);
        }
    } catch (err) {
        window.pqy_notify.warn('Sorry, error fetching members');
        console.log(err);
    }
}

$(window).on('load', function() {
    display();
});
