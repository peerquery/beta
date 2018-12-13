'use strict';

var templator = require('../../client/templator'),
    timeago = require('timeago.js')();

//jquery is already universal through the `ui.js` global file

var last_id = 0;

async function display() {
    $('#moreBtn').hide();
    $('#item-container').html('');
    $('#loader').show();

    var api = '/api/private/memberships/' + last_id;

    try {
        var projects = await Promise.resolve($.get(api));

        if (!projects || projects == '' || projects.length == 0) {
            $('#loader').hide();
            return;
        }

        if (projects.length == 20) {
            $('#moreBtn').show();
            last_id = projects[projects.length - 1]._id;
        }

        for (var x in projects) {
            projects[x].created = timeago.format(projects[x].created);
            if (!projects[x].role) projects[x].role = 'member';
            if (!projects[x].benefactor_rate) projects[x].benefactor_rate = '0';

            var project = await templator.membership(projects[x]);
            $('#item-container').append(project);
        }

        $('#loader').hide();
    } catch (err) {
        console.log(err);
    }
}

$('#moreBtn').on('click', function() {
    $(this).hide();
    display();
});

display();
