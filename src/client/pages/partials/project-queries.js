
'use strict';

var creator = require('./../../../lib/content-creator'),
    timeago = require('timeago.js')();
	
//jquery is already universal through the `ui.js` global file
	
var last_id = 0;
	
async function display() {
	
    $('#moreBtn').hide();
    $('#item-container').html('');
    $('#loader').show();
	
	
    try {
		
        var queries = await Promise.resolve($.get('/api/queries/project/' + project_slug + '/' + last_id));
		
        if (!queries || queries == '' || queries.length == 0 ) { $('#loader').hide(); return; }
		
        if (queries.length == 20) { $('#moreBtn').show(); last_id = queries[queries.length - 1]._id; }
		
        for (var x in queries) {
			
            //queries[x].created = timeago.format(queries[x].created);
            if (!queries[x].logo) queries[x].logo = '/images/placeholder.png';
			
            var query = await creator.query(queries[x]);
            $('#item-container').append(query);
			
        }
		
        $('#loader').hide();
		
        ready();
			
		
		
    } catch (err){
        console.log(err);
    }
	
}


$('#moreBtn').on('click', function() {
    $(this).hide();
    display();
});
	
	
$( window ).on( 'load', function() {
    display();
});
