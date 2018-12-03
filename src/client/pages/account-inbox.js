'use strict';

var templator = require('../../client/templator'),
    timeago = require('timeago.js')();

//jquery is already universal through the `ui.js` global file

var last_id = 0;

document.getElementById('loader').style.display = 'none';

async function display() {
    $('#moreBtn').hide();
    $('#item-container').html('');
    $('#loader').show();

    var api = '/api/peer/messages/' + last_id;

    try {
        var messages = await Promise.resolve($.get(api));

        if (!messages || messages == '' || messages.length == 0) {
            $('#loader').hide();
            return;
        }

        if (messages.length == 20) {
            $('#moreBtn').show();
            last_id = messages[messages.length - 1]._id;
        }

        for (var x in messages) {
            messages[x].created = timeago.format(messages[x].created);
            if (messages[x].state == 'pending')
                messages[x].title = '<b>' + messages[x].title + '</b>';

            var message = await templator.message(messages[x]);
            $('#item-container').append(message);
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

$('#item-container').on('click', '.read', async function() {
    try {
        window.show_modal('read');

        let msg_id = this.id;

        $('#active_id').text(msg_id);

        var api = '/api/peer/message/' + msg_id;

        var data = await Promise.resolve($.get(api));

        if (!data) {
            pqy_notify.warn('Sorry, failed to get content');
            window.close_modal('read');
            return;
        }

        $('#modal_title').html(data.title);
        $('#modal_content').html(data.body);
    } catch (err) {
        pqy_notify.warn('Sorry, an error occured');
        console.log(err);
    }
});

display();
