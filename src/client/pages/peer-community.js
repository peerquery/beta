'use strict';

var templator = require('../templator'),
    timeago = require('timeago.js')();

//jquery is already universal through the `ui.js` global file

const pathname = window.location.pathname;
const account = pathname.split('/peer/')[1].split('/')[0];
var last_id = 0;
var type = 'followers';

document.getElementById('profile_btn').href = '/peer/' + account;
document.getElementById('projects_btn').href = '/peer/' + account + '/projects';
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

async function display(type) {
    $('#moreBtn').hide();
    $('#item-container').html('');
    $('#loader').show();

    var api = '/api/relations/' + type + '/' + account + '/' + last_id;

    try {
        var community = await Promise.resolve($.get(api));

        if (!community || community == '' || community.length == 0) {
            $('#loader').hide();
            return;
        }

        if (community.length == 20) {
            $('#moreBtn').show();
            last_id = community[community.length - 1]._id;
        }

        for (var x in community) {
            community[x].created = timeago.format(community[x].updated);
            community[x].account =
                community[x].following || community[x].follower;

            if (type == 'supporters')
                community[x].rate =
                    String(community[x].benefactor_rate) +
                    ' <i class="percent icon"></i>';

            var peer = await templator.community(community[x]);
            $('#item-container').append(peer);
        }

        $('#loader').hide();

        ready();
    } catch (err) {
        console.log(err);
    }
}

$('#moreBtn').on('click', function() {
    $(this).hide();
    display(type);
});

$('#followers_btn').on('click', function() {
    type = 'followers';
    display(type);
});

$('#following_btn').on('click', function() {
    type = 'following';
    display(type);
});

$('#supporters_btn').on('click', function() {
    type = 'supporters';
    display(type);
});

display(type);
