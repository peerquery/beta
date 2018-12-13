'use strict';

var creator = require('../../lib/content-creator'),
    timeago = require('timeago.js')();

//jquery is already universal through the `ui.js` global file

const pathname = window.location.pathname;
const account = pathname.split('/peer/')[1].split('/')[0];
var last_id = 0;

document.getElementById('profile_btn').href = '/peer/' + account;
document.getElementById('projects_btn').href = '/peer/' + account + '/projects';
document.getElementById('reports_btn').href = '/peer/' + account + '/reports';
document.getElementById('wallet_btn').href = '/peer/' + account + '/wallet';
document.getElementById('community_btn').href =
    '/peer/' + account + '/community';

document.getElementById('user_account').innerText = account.toUpperCase();
document.getElementById('user_account').href = '/peer/' + account;
document.getElementById('account_img').src =
    'https://steemitimages.com/u/' + account + '/avatar';
document.getElementById('account_img').onerror = function() {
    this.src = '/assets/images/placeholder.png';
    this.onerror = '';
};

document.getElementById('spinner').style.display = 'none';

async function display() {
    $('#moreBtn').hide();
    $('#item-container').html('');
    $('#loader').show();

    var api = '/api/peer/queries/' + account + '/' + last_id;

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
            if (!queries[x].logo)
                queries[x].logo = '/assets/images/placeholder.png';

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
    display();
});

display();
