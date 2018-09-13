
'use strict';

var dsteem = require('dsteem'),
	create = require('./../../../src/lib/content-creator'),
	config = require('./../../../src/configs/config'),
	client = new dsteem.Client(config.steem_api);
	
	var peer = window.location.pathname.split('/')[2];
	var last_id = 0;
	var metaData;
	
async function display() {
	
	
	try {
		
		$("#moreBtn").hide();
		$("#item-container").html('');
		$("#post-loader").show();
		
		var results = await Promise.resolve($.get("/api/reports/user/" + peer + "/" + last_id));
		
		if(results.length == 0) {
			
			$("#post-loader").hide();
			
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
			
			for (var x in reports) {
				var post = await create.post(reports[x])
				$("#item-container").append(post);	
			}
			
			if(results.length == 20) { $('#moreBtn').show(); last_id = results[results.length - 1]._id; };
		
		}
		
		
	} catch(err){
		alert("Sorry, error fetching account");
		console.log(err);
	}
	
	
};



(async function user() {
    
	var acc = await client.database.getAccounts([peer]);
	//console.log(acc);
		
	if (acc == "" || acc[0] == "") {
		alert("Account does not exist!");
		return;
	} else {
	
		acc = acc[0];
	
		document.getElementById("created").innerText = new Date(acc.created).toDateString();
	
		if (acc.json_metadata) {
			metaData = JSON.parse(acc.json_metadata);
	
			if (metaData.profile) {
		
				if(metaData.profile.about != undefined || "") document.getElementById("bio").innerText = metaData.profile.about;
			if(metaData.profile.website != undefined || "") document.getElementById("website_btn").href = metaData.profile.website;
				if(metaData.profile.location != undefined || "") document.getElementById("location").innerText = metaData.profile.location;
		
			}
		}
	
	}
		
	document.title = "@" + peer + " - Peer Query";
	document.getElementById("steemit_btn").href = "http://steemit.com/@" + peer;
	
	document.getElementById("userImg").src = "https://steemitimages.com/u/" + peer + "/avatar";
	document.getElementById('userImg').onerror = function() {this.src='/assets/img/avatar.png'; this.onerror='';};
	document.getElementById("username").innerText = "@" + peer;
})();


$('#moreBtn').on('click', function() {
	$(this).hide();
	display();
})
	
display();
