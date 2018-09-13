
'use strict';

var dsteem = require('dsteem'),
	templator = require('../templator'),
	config = require('../../configs/config'),
	utils = require('../../lib/utils'),
	parser = require('../../lib/post-parser-web'),
	creator = require('../../lib/content-creator'),
	issues_renderer = require('../renderers/issues'),
	client = new dsteem.Client(config.steem_api),
	timeago = require("timeago.js")();
	//jquery is already universal through the `ui.js` global file
	
	
(async () => {
	
	try {
		
		var permlink = window.location.pathname.split('/')[2];
		var author = permlink.split('-')[0];
		
		var type = "writes in";
		
		/*
		if (category == "proposal") type = "proposes in";
		if (category == "question") type = "questions in";
		if (category == "contest") type = "contests in";
		if (category == "quiz") type = "quizzes in";
		if (category == "gig") type = "outsources in";
		*/
		
		const report = await client.database.call('get_content', [author, permlink]);
		
		
		const data = {};
		data.title = report.title;
		data.author = report.author;
		data.author_name = report.author.toUpperCase();
		data.author_href = "/@" + report.author;
		data.author_img = "https://steemitimages.com/u/" + report.author + "/avatar";
		data.category = report.category;
		data.type = type;
		data.created = timeago.format(report.created);
		data.author_rep = utils.reputation(report.author_reputation);
		data.body = parser.content(report.body);
		
		data.active_votes = report.active_votes.length;
		data.active_comments = report.children;
		data.earned = Math.max(Number(report.pending_payout_value.split(' ')[0]), Number(report.total_payout_value.split(' ')[0]) + Number(report.curator_payout_value.split(' ')[0])).toFixed();
		
		if (author == active_user) {
			data.follow_btn_class = "ui disabled button";
			data.resteem_btn_class = "ui disabled right floated button"
		}
		
		
		//tags
		if (report.json_metadata) {
			var metadata = JSON.parse(report.json_metadata);
			if (metadata.tags) {
				data.issues = await issues_renderer(metadata.tags);
			}
		}
		
		
		
		//social media button hrefs
		data.fb = "https://www.facebook.com/sharer/sharer.php?u=" + window.location;
		data.twitter = "http://twitter.com/share?text=" + document.title + report.title + "&url=" + window.location + "&hashtags=peerquery," + report.category;
		data.gplus = "https://plus.google.com/share?url=" + window.location;
		data.linkedin = "https://www.linkedin.com/shareArticle?mini=true&url=" + window.location + "&title=" + encodeURI(report.title) + "&summary=&source=peerquery.com";
		data.reddit = "http://reddit.com/submit?url=" + window.location + "&amp;title=" + document.title;
		data.tumblr = "http://www.tumblr.com/share?v=3&u=" + window.location + "&t=" + document.title;
		
		
			var report_view = await templator.report_view(data);
			$("#report_view").append(report_view);
			
			$("#loader").hide();
		
		var comments = await client.database.call('get_content_replies', [author, permlink]);
		
		for (var x in comments) {
			var comment = await creator.comment(comments[x]);
			$("#comments-container").append(comment);	
		}
		
		
		
		
		$("#share-toggle").on('click', function(){
	
			$("#share-area").slideToggle("slow");
			
		});
   
		
		
		
	} catch(err){
		console.log(err);
	}
	

})();