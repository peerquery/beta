'use strict';

var templator = require('../../client/templator'),
    timeago = require('timeago.js')();

//jquery is already universal through the `ui.js` global file

var last_id = 0;
var active_type = '';

async function display(type) {
    active_type = type;

    $('#moreBtn').hide();
    $('#user-container').html('');
    $('#loader').show();

    var api = '/api/fetch/peers/' + active_type + '/' + last_id;

    try {
        var users = await Promise.resolve($.get(api));

        if (!users || users == '' || users.length == 0) {
            $('#loader').hide();
            return;
        }

        if (users.length == 20) {
            $('#moreBtn').show();
            last_id = users[users.length - 1]._id;
        }

        for (var x in users) {
            users[x].last_project_title =
                users[x].last_project_title || ' the next?';
            users[x].last_project_slug_id =
                users[x].last_project_slug_id || '#';
            users[x].skill = users[x].skill || 'searching';
            users[x].position = users[x].position || 'Works';
            users[x].company = users[x].company || 'Private';

            var user = await templator.peer(users[x]);
            $('#user-container').append(user);
        }

        $('#loader').hide();
    } catch (err) {
        console.log(err);
    }
}

$('#moreBtn').on('click', function() {
    $(this).hide();
    display(active_type);
});

$('#features').on('click', function() {
    last_id = 0;
    display(this.id);
});

$('#interesting').on('click', function() {
    last_id = 0;
    display(this.id);
});

$('#observers').on('click', function() {
    last_id = 0;
    display(this.id);
});

display('featured');
