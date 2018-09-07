
'use strict';

const utils = require('./../../src/lib/utils'),
	parser = require('./../../src/lib/post-parser-web'),
	timeago = require('timeago.js'),
	timeagoInstance = timeago();

module.exports = {
	
	post: async function(text) {
		var resteem_state = "hidden";
		if (text.first_reblogged_on) resteem_state = "visible";
		
		var summary = await parser.summary(text.body, 150);
		var src = await parser.first_img(text.body);
	
		var item = document.createElement("div");
		item.className = "item";
	
		var image_div = document.createElement("div");
		image_div.className = "ui small image";
	
		var post_image = document.createElement("img");
		post_image.onerror = function() {this.src='/assets/images/placeholder.png'; this.onerror='';};
		post_image.style.height = "124px";
		post_image.style.width = "150px";
		post_image.src = src;
	
		image_div.appendChild(post_image);
	
		var content_div = document.createElement("div");
		content_div.className = "content";
	
		var header_a = document.createElement("a");
		header_a.className = "header";
		header_a.href = "/@" + text.author + "/" + text.permlink;
		header_a.innerText = text.title;
		
		var extra_div = document.createElement("div");
		extra_div.className = "extra";
		
		var author_a = document.createElement("a");
		author_a.className = "ui blue image label";
		author_a.href = "/@" + text.author;
		
		var author_img = document.createElement("img");
		author_img.onerror = function() {this.src='/assets/images/placeholder.png'; this.onerror='';};
		author_img.src = "https://steemitimages.com/u/" + text.author + "/avatar";
		
		var author_span = document.createElement("span");
		author_span.innerText = text.author;
	
		var author_rep_div = document.createElement("div");
		author_rep_div.className = "detail";
		author_rep_div.title = "User's reputation";
		author_rep_div.innerText = await utils.reputation(text.author_reputation);
	
		author_a.appendChild(author_img);
		author_a.appendChild(author_span);
		author_a.appendChild(author_rep_div);
	
		var time_span = document.createElement("span");
	
		var time_span_icon = document.createElement("i");
		time_span_icon.className = "wait icon";
	
		var time = document.createElement("span");
		time.className = "timeago";
		time.title = text.created;
		time.innerText = timeagoInstance.format(text.created);
	
		time_span.appendChild(time_span_icon);
		time_span.appendChild(time);
	
		var pop = document.createElement("a");
		pop.className = "pop";
		pop.title = "Preview";
		pop.setAttribute("data-account", text.author); 
		pop.setAttribute("data-title", text.title); 
		pop.setAttribute("data-permlink", text.permlink);
		pop.setAttribute("data-body", await parser.content(text.body));    //------------- use parser to do light-parsing of content to be displayed
		pop.innerHTML = "<i class='small circular inverted blue bug icon'></i>";
		
		
		var i_resteem = document.createElement("i");
		i_resteem.title = "Resteemed";
		i_resteem.style.paddingLeft = "2px";
		i_resteem.style.visibility = resteem_state;
		i_resteem.className = "small circular pink inverted fitted refresh icon";
	
		extra_div.appendChild(author_a);
		extra_div.appendChild(time_span);
		extra_div.appendChild(pop);
		extra_div.appendChild(i_resteem);
		
		var description_div = document.createElement("div");
		description_div.className = "description";
		description_div.innerText = summary;
		
		var extra_label_div = document.createElement("div");
		extra_label_div.className = "extra";
		
		var a_category = document.createElement("a");
		a_category.className = "ui label";
		a_category.title = "Category";
		//a_category.href = "/issue/" + text.parent_permlink;
		
		var i_category = document.createElement("i");
		i_category.className = "tag icon";
		
		var span_category = document.createElement("span");
		span_category.innerText = text.parent_permlink;
		
		a_category.appendChild(i_category);
		a_category.appendChild(span_category);
		
		var a_earned = document.createElement("a");
		a_earned.className = "ui label";
		a_earned.title = "Earned";
	
		var i_earned = document.createElement("i");
		i_earned.className = "dollar icon";
		
		var span_earned = document.createElement("span");
		span_earned.innerText = Math.max(Number(text.pending_payout_value.split(' ')[0]), Number(text.total_payout_value.split(' ')[0]) + Number(text.curator_payout_value.split(' ')[0])).toLocaleString();
		
		a_earned.appendChild(i_earned);
		a_earned.appendChild(span_earned);
	
		var a_votes = document.createElement("a");
		a_votes.className = "ui label";
		a_votes.title = "Votes";
		
		var i_votes = document.createElement("i");
		i_votes.className = "heart icon";
	
		var span_votes = document.createElement("span");
		span_votes.innerText = Number(text.active_votes.length).toLocaleString();
		
		a_votes.appendChild(i_votes);
		a_votes.appendChild(span_votes);
	
		var a_responses = document.createElement("a");
		a_responses.className = "ui label";
		a_responses.title = "Responses";
	
		var i_responses = document.createElement("i");
		i_responses.className = "comments icon";
	
		var span_responses = document.createElement("span");
		span_responses.innerText = text.children.toLocaleString();
	
		a_responses.appendChild(i_responses);
		a_responses.appendChild(span_responses);
	
		extra_label_div.appendChild(a_category);
		extra_label_div.appendChild(a_earned);
		extra_label_div.appendChild(a_votes);
		extra_label_div.appendChild(a_responses);
		
		content_div.appendChild(header_a);
		content_div.appendChild(extra_div);
		content_div.appendChild(description_div);
		content_div.appendChild(extra_label_div);
	
		item.appendChild(image_div);
		item.appendChild(content_div);
	
		return item;
	
	},
	
	comment_summary: async function(cmt) {
	
		var summary = await parser.summary(cmt.body, 100);
	
		var comment = document.createElement("div");
		comment.className = "comment";
	
		var a_avatar = document.createElement("a");
		a_avatar.className = "avatar";
	
		var img_avatar = document.createElement("img");
		img_avatar.onerror = function() {this.src='/assets/images/placeholder.png'; this.onerror='';};
		img_avatar.src = "https://steemitimages.com/u/" + cmt.author + "/avatar";
		img_avatar.style.width = "40px";
		img_avatar.style.height = "40px";
	
		a_avatar.appendChild(img_avatar);
	
		var div_content = document.createElement("div");
		div_content.className = "content";
	
		var a_author = document.createElement("a");
		a_author.className = "author";
		a_author.href = "/@" + cmt.author;
		a_author.innerText = "@" + cmt.author + "(" + await utils.reputation(cmt.author_reputation) + ")";
	
		var div_meta = document.createElement("div");
		div_meta.className = "metadata";
	
		var div_date = document.createElement("div");
		div_date.className = "date";
	
		var i_date = document.createElement("i");
		i_date.className = "wait icon";
	
		var span_date = document.createElement("span");
		span_date.title = cmt.created;
		span_date.className = "timeago";
		span_date.innerText = timeagoInstance.format(cmt.created);
	
		div_date.appendChild(i_date);
		div_date.appendChild(span_date);
	
		var div_votes = document.createElement("div");
		div_votes.className = "rating";
	
		var i_votes = document.createElement("i");
		i_votes.className = "heart icon";
	
		var span_votes = document.createElement("span");
		span_votes.innerText = Number(cmt.net_votes).toLocaleString();
	
		div_votes.appendChild(i_votes);
		div_votes.appendChild(span_votes);
	
		var div_earned = document.createElement("div");
		div_earned.className = "earned";
	
		var i_earned = document.createElement("i");
		i_earned.className = "dollar icon";
	
		var span_earned = document.createElement("span");
		span_earned.innerText = Math.max(Number(cmt.pending_payout_value.split(' ')[0]), Number(cmt.total_payout_value.split(' ')[0]) + Number(cmt.curator_payout_value.split(' ')[0])).toLocaleString();
	
		div_earned.appendChild(i_earned);
		div_earned.appendChild(span_earned);
		
		var div_comment = document.createElement("div");
		div_comment.className = "text";
		div_comment.innerText = summary;
	
		div_meta.appendChild(div_date);
		div_meta.appendChild(div_votes);
		div_meta.appendChild(div_earned);
		
		div_content.appendChild(a_author);
		div_content.appendChild(div_meta);
		div_content.appendChild(div_comment);
	
		comment.appendChild(a_avatar);
		comment.appendChild(div_content);
		
		return comment;
	
	},
	
	tag: async function (tag, num) {
	
		var item = document.createElement("a");
		item.className = "item";
		//item.href = "/issue/" + tag.name;
	
		var label1 = document.createElement("div");
		label1.className = "ui red horizontal right pointing label";
		label1.innerText = "(" + Number(num) + ") " + tag.name;
	
		var label2 = document.createElement("div");
		label2.className = "ui horizontal label";
		label2.title = "Earnings";
		label2.innerText = "$" + Number(tag.total_payouts.split('.')[0]).toLocaleString();
	
		var label3 = document.createElement("span");
		label3.className = "ui horizontal label";
		label3.title = "Top posts";
		label3.innerText = "#" + Number(tag.top_posts).toLocaleString();
	
		item.appendChild(label1);
		item.appendChild(label2);
		item.appendChild(label3);
	
		return item;
	},
	
	comment: async function(response) {
	
		var item = document.createElement("div");
		item.id = "item-" + response.id;
		item.className = "item";
	
		var author_img_div = document.createElement("div");
		author_img_div.className = "ui tiny image";
	
	
		var author_img = document.createElement("img");
		author_img.className = "ui avatar image";
		author_img.style.height = "80px";
		author_img.style.width = "80px";
		author_img.src =  "https://img.busy.org/@" + response.author;
		author_img.onerror = function() {this.src='/assets/img/avatar.png'; this.onerror='';};
	
	
	
		var stats_div = document.createElement("div");
		stats_div.className = "ui tiny statistic voter-popup";
		stats_div.id = response.id + "-voterlist";
	
		var div_votes = document.createElement("div");
		div_votes.className = "value";
	
		var span_votes = document.createElement("span");
		//
		//NOT ACCUTATE AT ALL. CONTAINS BOTH UPVOTES AND DOWNVOTES. WE NEED TO GET ALL VOTES FROM STEEM THEN GET ONLY UPVOTES THROUGH UTILS.COUNT_VOTES()...
		//
		span_votes.innerText = response.net_votes.toLocaleString();
		span_votes.id= response.id + "-rescount";
	
		div_votes.appendChild(span_votes);
	
	
		var div_votes_icon = document.createElement("div");
		div_votes_icon.className = "value";
	
		var i_votes = document.createElement("i");
		i_votes.className = "thumbs outline up icon";
	
		div_votes_icon.appendChild(i_votes);
	
	
		stats_div.appendChild(div_votes);
		stats_div.appendChild(div_votes_icon);
	
	
		author_img_div.appendChild(author_img);
		author_img_div.appendChild(stats_div);
	
		//item.appendChild(author_img_div);
	
	
		var content = document.createElement("div");
		content.className = "content";
	
		var header = document.createElement("a");
		header.className = "header";
		header.href = "#" + response.id;
		header.innerText = response.id;
	
		var div_author = document.createElement("div");
		div_author.className = "meta";
	
		var au_author = document.createElement("a");
		au_author.href = "/@" + response.author;
		au_author.innerText = "@" + response.author.toUpperCase() + "(" + utils.reputation(response.author_reputation) + ")";
	
		div_author.appendChild(au_author);
	
		var div_response = document.createElement("div");
		div_response.className = "description post-body";
		div_response.innerHTML = parser.content(response.body);
	
	
	
		var vote_div = document.createElement("div");
		vote_div.className = "ui clearing segment middle aligned stackable grid";
		vote_div.id = response.id + "-div";
		vote_div.style.display = "none";
	
		var slider_area = document.createElement("div");
		slider_area.className = "ui slidercontainer twelve wide column";
	
		var slider_input = document.createElement("input");
		slider_input.className = "slider";
		slider_input.type = "range";
		slider_input.min = "100";
		slider_input.max = "10000";
		slider_input.value = "500";
		slider_input.id = response.id + "-range";
	
		slider_area.appendChild(slider_input);
	
	
		var vote_col_div = document.createElement("div");
		vote_col_div.className = "four wide column";
	
		var vote_btn_div = document.createElement("div");
		vote_btn_div.className = "ui mini right floated left labeled button";
		vote_btn_div.setAttribute("tabindex", "0");
	
	
	
	
		var a_icon = document.createElement("a");
		a_icon.className = "ui basic right pointing label";
	
		var i_vote_icon = document.createElement("i");
		i_vote_icon.className = "heart icon";
	
		a_icon.appendChild(i_vote_icon);
	
	
	
	
		var div_vote_percent = document.createElement("div");
		div_vote_percent.className = "ui mini button";
		div_vote_percent.id = response.id + "-btn";
		div_vote_percent.innerText = "+5%";
		div_vote_percent.dataset.votestate = "false";
		div_vote_percent.dataset.value = "500";
		div_vote_percent.dataset.href = response.permlink;
		div_vote_percent.dataset.author = response.author;
		div_vote_percent.onclick = function() { vote(this.id) };
	
	
	
		vote_btn_div.appendChild(a_icon);
		vote_btn_div.appendChild(div_vote_percent);
	
		vote_col_div.appendChild(vote_btn_div);
	
		vote_div.appendChild(slider_area);
	
	
		vote_div.appendChild(vote_col_div);
	
	
	
	
	
		var div_extra = document.createElement("div");
		div_extra.className = "extra";
	
	
		var div_time = document.createElement("div");
		div_time.className = "ui label";
	
		var i_time_icon = document.createElement("i");
		i_time_icon.className = "wait icon";
	
		var span_time = document.createElement("span");
		span_time.className = "timeago";
		span_time.innerText = timeagoInstance.format(response.created);
	
		div_time.appendChild(i_time_icon);
		div_time.appendChild(span_time);
	
	
		var div_vote_toggle = document.createElement("div");
		div_vote_toggle.className = "ui left labeled right floated tiny button";
		div_vote_toggle.setAttribute("tabindex", "0");
		div_vote_toggle.id = response.id;
		div_vote_toggle.onclick = function(e) {e.preventDefault(); votePanelBtn(this.id) };
	
	
		var comment_earned = Math.max(Number(response.pending_payout_value.split(' ')[0]), Number(response.total_payout_value.split(' ')[0]) + Number(response.curator_payout_value.split(' ')[0])).toLocaleString();
	
	
		var a_earned = document.createElement("div");
		a_earned.className = "ui basic right pointing label";
		a_earned.innerText = "$" + comment_earned;
	
	
		//responders_earned = responders_earned + Number(comment_earned);
	
	
		var earned_icon_div = document.createElement("div");
		earned_icon_div.className = "ui tiny button";
		earned_icon_div.id = response.id + "-percent";
	
		var i_vote_icon2 = document.createElement("i");
		i_vote_icon2.className = "thumbs up icon";
	
		var span_upvote = document.createElement("span");
		span_upvote.className = "desktop-only";
		span_upvote.innerText = "Upvote";
	
		earned_icon_div.appendChild(i_vote_icon2);
		earned_icon_div.appendChild(span_upvote);
	
		div_vote_toggle.appendChild(a_earned);
		div_vote_toggle.appendChild(earned_icon_div);
	
	
		div_extra.appendChild(div_time);
		div_extra.appendChild(div_vote_toggle);
	
	
		content.appendChild(header);
		content.appendChild(div_author);
		content.appendChild(div_response);
		content.appendChild(vote_div);
		content.appendChild(div_extra);
	
	
		item.appendChild(author_img_div);
		item.appendChild(content);
	
	
		return item;
	
	},
	
	member: async function (data) {
		
		var item = document.createElement("div");
		item.className = "item";
	
		var img = document.createElement("img");
		img.className = "ui avatar image";
		img.src = "https://steemitimages.com/u/" + data.account + "/avatar";
	
		var content = document.createElement("div");
		content.className = "content";
	
		var a = document.createElement("a");
		a.className = "header";
		a.href = "/@" + data.account;
		a.target = "_blank";
		a.innerText = data.account;
		
		var description = document.createElement("div");
		description.className = "description";
		description.innerText = "Joined " + new Date(data.created).toDateString();
		
		content.appendChild(a);
		content.appendChild(description);
		
		item.appendChild(img);
		item.appendChild(content);
	
		return item;
	}
	
	
}
