'use strict';

var templator = require('../../client/templator'),
    timeago = require('timeago.js')();

//jquery is already universal through the `ui.js` global file

var last_id = 0;
var active_type = '';

async function display(type) {
    active_type = type;

    $('#moreBtn').hide();
    $('#item-container').html('');
    $('#loader').show();

    var api = '/api/fetch/projects/' + active_type + '/' + last_id;

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
            if (!projects[x].logo) projects[x].logo = '/images/placeholder.png';

            var project = await templator.project(projects[x]);
            $('#item-container').append(project);
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

$('#featured').on('click', function() {
    last_id = 0;
    display('featured');
});

$('#active').on('click', function() {
    last_id = 0;
    display('active');
});

$('#hibernation').on('click', function() {
    last_id = 0;
    display('hibernation');
});

$('#created').on('click', function() {
    last_id = 0;
    display('created');
});

$('#random').on('click', function() {
    last_id = 0;
    display('random');
});

display('featured');
