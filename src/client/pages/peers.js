
'use strict';

var dsteem = require('dsteem'),
    templator = require('../../client/templator'),
    config = require('./../../../src/configs/config'),
    client = new dsteem.Client(config.steem_api),
    timeago = require('timeago.js')();
	
//jquery is already universal through the `ui.js` global file

var last_id = 0;
var active_type = '';
	
async function display(type) {
	
    active_type = type;
	
    $('#moreBtn').hide();
    $('#user-container').html('');
    $('#loader').show();
	
    var api = '/api/fetch/users/' + active_type + '/' + last_id;
	
    try {
		
        var rate = await client.database.call('get_current_median_history_price');
        $('#sbd-quote').text(rate.base);
		
        var blog = await client.database.getDiscussions('blog', {tag: config.steem_account, limit: 1});
        $('#last-blog-post').html('<a href=\'/' + blog[0].parent_permlink + '/@' + blog[0].author + '/' + blog[0].permlink + '\'>' + blog[0].title + '</a>');
        $('#from-blog').show();
		
		
        var users = await Promise.resolve($.get(api));
		
        if (!users || users == '' || users.length == 0 ) { $('#loader').hide(); return; }
		
        if (users.length == 20) { $('#moreBtn').show(); last_id = users[users.length - 1]._id; }
		
        for (var x in users) {
			
            users[x].created = timeago.format(users[x].created);
			
            if (!users[x].badge) users[x].badge_div = '<div class="ui red horizontal label">observer</div>'; //incase users do not have badge
            
            if (users[x].badge == 'observer') users[x].badge_div = '<div class="ui red horizontal label">observer</div>';
            if (users[x].badge == 'querant') users[x].badge_div = '<div class="ui purple horizontal label">querant</div>';
            if (users[x].badge == 'reporter') users[x].badge_div = '<div class="ui blue horizontal label">reporter</div>';
            if (users[x].badge == 'builder') users[x].badge_div = '<div class="ui yellow horizontal label">builder</div>';
			
            var user = await templator.peer(users[x]);
            $('#user-container').append(user);
			
        }
		
        $('#loader').hide();
		
    } catch (err){
        console.log(err);
    }
	
}


$('#moreBtn').on('click', function() {
    $(this).hide();
    display(active_type);
});
	
	
$('#builders').on('click', function() {
    last_id = 0;
    display('builders');
});

$('#reporters').on('click', function() {
    last_id = 0;
    display('reporters');
});

$('#observers').on('click', function() {
    last_id = 0;
    display('observers');
});
	
	
display('builders');

