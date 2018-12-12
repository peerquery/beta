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

    var api = '/api/private/hires/' + last_id;

    try {
        var hires = await Promise.resolve($.get(api));

        if (!hires || hires == '' || hires.length == 0) {
            $('#loader').hide();
            return;
        }

        if (hires.length == 20) {
            $('#moreBtn').show();
            last_id = hires[hires.length - 1]._id;
        }

        for (var x in hires) {
            hires[x].created = timeago.format(hires[x].created);
            hires[x].title = '<b>' + hires[x].title + '</b>';

            var hire = await templator.hire(hires[x]);
            $('#item-container').append(hire);
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
