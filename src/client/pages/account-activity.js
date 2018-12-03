'use strict';

var templator = require('../../client/templator'),
    timeago = require('timeago.js')(),
    mtools = require('markup-tools');

//jquery is already universal through the `ui.js` global file

var last_id = 0;

document.getElementById('loader').style.display = 'none';

async function display() {
    $('#moreBtn').hide();
    $('#item-container').html('');
    $('#loader').show();

    var api = '/api/peer/activity/' + last_id;

    try {
        var activities = await Promise.resolve($.get(api));

        if (!activities || activities == '' || activities.length == 0) {
            $('#loader').hide();
            return;
        }

        if (activities.length == 20) {
            $('#moreBtn').show();
            last_id = activities[activities.length - 1]._id;
        }

        for (var x in activities) {
            activities[x].created = timeago.format(activities[x].created);
            activities[x].icon = 'cog';

            activities[x].message = mtools.build.mentions(
                activities[x].description || activities[x].title || ''
            );

            if (activities[x].action == 'create') activities[x].icon = 'plus';
            if (activities[x].action == 'edit') activities[x].icon = 'edit';
            if (activities[x].action == 'update') activities[x].icon = 'edit';
            if (activities[x].action == 'delete') activities[x].icon = 'times';

            var activity = await templator.activity(activities[x]);
            $('#item-container').append(activity);
        }

        $('#loader').hide();
    } catch (err) {
        console.log(err);
    }
}

//set click listeners

$('#moreBtn').on('click', function() {
    $(this).hide();
    display();
});

display();
