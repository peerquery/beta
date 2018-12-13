'use strict';

var templator = require('../../client/templator'),
    templates = require('../../configs/event-message-templates'),
    mtools = require('markup-tools'),
    timeago = require('timeago.js')();

//jquery is already universal through the `ui.js` global file

var last_id = 0;

document.getElementById('loader').style.display = 'none';

async function display() {
    $('#moreBtn').hide();
    $('#item-container').html('');
    $('#loader').show();

    var api = '/api/peer/notifications/' + last_id;

    try {
        var notifications = await Promise.resolve($.get(api));

        if (
            !notifications ||
            notifications == '' ||
            notifications.length == 0
        ) {
            $('#loader').hide();
            return;
        }

        if (notifications.length == 20) {
            $('#moreBtn').show();
            last_id = notifications[notifications.length - 1]._id;
        }

        for (var x in notifications) {
            notifications[x].created = timeago.format(notifications[x].created);

            let template = templates[notifications[x].event];

            if (template)
                notifications[x].message = mtools.build.template(
                    template,
                    notifications[x]
                );

            if (
                !notifications[x].message ||
                notifications[x].message == undefined ||
                notifications[x].message == 'undefined'
            )
                notifications[x].message =
                    notifications[x].event + ': ' + notifications[x].from;

            if (notifications[x].from_account) {
                notifications[x].graphics =
                    '<img src="https://steemitimages.com/u/' +
                        notification[x].from ||
                    notification[x].from_account + '/avatar">';
            } else {
                notifications[x].graphics = '<i class="coffee icon"></i>';
            }

            var notification = await templator.notification(notifications[x]);
            $('#item-container').append(notification);
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
