'use strict';

var templator = require('../../client/templator'),
    timeago = require('timeago.js')();

//jquery is already universal through the `ui.js` global file

const pathname = window.location.pathname;
const account = pathname.split('/peer/')[1].split('/')[0];
var last_id = 0;

document.getElementById('account_btn').href = '/peer/' + account;
document.getElementById('reports_btn').href = '/peer/' + account + '/reports';
document.getElementById('queries_btn').href = '/peer/' + account + '/queries';
document.getElementById('wallet_btn').href = '/peer/' + account + '/wallet';

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

    var api = '/api/peer/projects/' + account + '/' + last_id;

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
            if (!projects[x].logo)
                projects[x].logo = '/assets/images/placeholder.png';

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
    display();
});

display();
