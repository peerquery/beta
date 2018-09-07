
'use strict';

var dsteem = require('dsteem'),
	config = require('../../configs/config'),
	create = require('../../lib/content-creator'),
	client = new dsteem.Client(config.steem_api);
	//jquery is already universal through the `ui.js` global file
	
	var last_id = 0;
	var active_type = '';
	
async function display(type) {
	
	try {
		
		$("#moreBtn").hide();
		$("#item-container").html('');
		$("#responses-container").html('');
		$("#responses-label").css("visibility", "hidden");
		$("#post-loader").show();
		$("#responses-loader").show();
		
		active_type = type;
		
		var results = await Promise.resolve($.get("/api/reports/" + type + "/" + last_id));
		
		if(results.length == 0) {
			
			$("#post-loader").hide();
			$("#responses-loader").hide();
		
			return;
			
		} else {
			
			async function get_posts(data) {
			
				var posts = [];
			
				for(var x in data) {
				
					var post = await client.database.call('get_content', [data[x].author, data[x].permlink]);
					if(post && post.author !== '') posts.push(post);
				
				}
			
				return posts
			
			}
			
			const reports = await get_posts(results);
			
			$("#post-loader").hide();
			$("#responses-loader").hide();
			
			for (var x in reports) {
				var post = await create.post(reports[x])
				$("#item-container").append(post);	
			}
			
			if(results.length == 20) { $('#moreBtn').show(); last_id = results[results.length - 1]._id; };
		
			get_responses_to_top(reports[0]);
		
		}
		
	} catch(err){
		console.log(err);
	}
	
}


async function get_responses_to_top(result) {
	
	try {
		var comments = await client.database.call('get_content_replies', [result.author, result.permlink]);
		$("#responses-title").text(result.title);
		$("#responses-label").css("visibility", "visible");
		
		for(var x in comments) {
			if(x == "25") return; //never display more than 25 recent comments
			var comment = await create.comment_summary(comments[x])
			$("#responses-container").append(comment);	
		}
		
	} catch(err) {
		console.log(err);
	}
	
}
	
	
	
$('#moreBtn').on('click', function() {
	$(this).hide();
	display(active_type);
})
	

$('#featured').on('click', function() {
	display('featured');
})

$('#popular').on('click', function() {
	display('popular');
})

$('#trending').on('click', function() {
	display('trending');
})

$('#discussed').on('click', function() {
	display('discussed');
})

$('#created').on('click', function() {
	display('created');
})

	
display('featured');

