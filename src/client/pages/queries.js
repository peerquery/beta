'use strict';

var creator = require('../../lib/content-creator'),
    timeago = require('timeago.js')();

//jquery is already universal through the `ui.js` global file

var last_id = 0;
var active_type = '';

async function display(type) {
    active_type = type;

    $('#moreBtn').hide();
    $('#item-container').html('');
    $('#loader').show();

    var api = '/api/fetch/queries/' + active_type + '/' + last_id;

    try {
        var queries = await Promise.resolve($.get(api));

        if (!queries || queries == '' || queries.length == 0) {
            $('#loader').hide();
            return;
        }

        if (queries.length == 20) {
            $('#moreBtn').show();
            last_id = queries[queries.length - 1]._id;
        }

        for (var x in queries) {
            //queries[x].created = timeago.format(queries[x].created);
            if (!queries[x].logo) queries[x].logo = '/images/placeholder.png';

            var query = await creator.query(queries[x]);
            $('#item-container').append(query);
        }

        $('#loader').hide();

        ready();
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

$('#voted').on('click', function() {
    last_id = 0;
    display('voted');
});

$('#viewed').on('click', function() {
    last_id = 0;
    display('viewed');
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
