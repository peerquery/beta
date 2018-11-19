'use strict';

let templator = require('../../client/templator'),
    timeago = require('timeago.js')();

//jquery is already universal through the `ui.js` global file

$('#search_btn').click(function() {
    $(this).addClass('disabled');

    var q = $('#search_input').val();
    var type = $('#search_type').val();

    if (!q) return;

    let params = {
        q: q,
        type: type,
    };

    let esc = encodeURIComponent;
    let query = Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');

    history.pushState('', q, window.location.pathname + '?' + query);

    search();
});

if (window.location.search) search();

async function search() {
    $('#moreBtn').hide();
    $('#results-container').html('');
    $('#loader').show();
    $('#search_details').text('');

    let params = new URL(document.location).searchParams;

    let query = params.get('q');
    let type = params.get('type');
    if (!type) type = 'reports';

    $('#search_input').val(query);
    window.set_type(type);

    var last_id = 0;

    var api = '/api/fetch/search/' + type + '/' + last_id;

    try {
        let data = {};
        data.query = query;
        data.type = type;

        var results = await Promise.resolve($.post(api, data));

        $('#loader').hide();

        $('#search_details').text(results.length + ' results returned.');

        $('#search_btn').removeClass('disabled');

        if (!results.length) {
            let msg =
                'Sorry, nothing found. You can <b><a href="/create">create</a></b> it instead.';
            $('#results-container').append(msg);
        } else {
            for (var x in results) {
                results[x].created = timeago.format(results[x].created);

                var result = await templator.search(results[x]);

                $('#results-container').append(result);

                if (results.length == 20) {
                    $('#moreBtn').show();
                    last_id = results[results.length - 1]._id;
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
}

$('#moreBtn').on('click', function() {
    $(this).hide();
    search();
});
