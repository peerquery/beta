
'use strict';

module.exports = {
	
    reputation: function(rep2) {
		
		if (rep2 == null) return rep2;
		let rep = String(rep2);
		const neg = rep.charAt(0) === '-';
		rep = neg ? rep.substring(1) : rep;
		
		let out = log10(rep);
		if (isNaN(out)) out = 0;
		out = Math.max(out - 9, 0); // @ -9, $0.50 earned is approx magnitude 1
		out = (neg ? -1 : 1) * out;
		out = out * 9 + 25; // 9 points per magnitude. center at 25
		// base-line 0 to darken and < 0 to auto hide (grep rephide)
		out = parseInt(out);
		return out;
		
		function log10(str) {
			const leadingDigits = parseInt(str.substring(0, 4));
			const log = Math.log(leadingDigits) / Math.LN10 + 0.00000001;
			const n = str.length - 1;
			return n + (log - parseInt(log));
		}
		
	},
	
	count_votes: function(votes) {
		var unVotes = votes.reduce(function (n, vot) {
			return n + (vot.percent == '0');
		}, 0);
		//console.log("Number of votes removed is: " + unVotes);
		return votes.length - unVotes;
	},
    
    
    check_vote: async function(resp, voteArray) {
    
        for (var x in voteArray) {
	
            if (voteArray[x].voter == active_user && voteArray[x].percent > 0) {
                document.getElementById(resp.id + "-percent").innerHTML = "<span class='desktop-only'> Voted at: </span>" + voteArray[x].percent/100 + "%";
                document.getElementById(resp.id + "-btn").dataset.votestate = "true";
                document.getElementById(resp.id + "-btn").dataset.value = "0";
                document.getElementById(resp.id + "-range").value = voteArray[x].percent;
                document.getElementById(resp.id + "-range").disabled = true;
                document.getElementById(resp.id + "-btn").innerText = " Unvote";
            } else {
                //document.getElementById(resp.id + "-range").value = "500";
            }
        }
	
        //console.log(resp, voteArray);
	
        document.getElementById(resp.id + "-voterlist").dataset.html = "<div>" + await this.list_voters(voteArray) + "</div>";
    
    },
	
    
    
    check_response_votes: async function(response, netVotes, activeVotes) {
	
        if (netVotes > 0) { 
            document.getElementById(response.id + "-rescount").innerText = " +" + this.count_votes(activeVotes);
        } else if (netVotes < 0) {
            document.getElementById(response.id + "-rescount").innerText = " -" + this.count_votes(activeVotes);
        } else if  (netVotes == 0) {
            document.getElementById(response.id + "-rescount").innerText = " 0";
        }
	
        this.check_vote(response, activeVotes);
	
    },
    
    
	list_voters: async function(votes) {
	
        if(votes.length == 0) return "No votes yet.";
	
        var voter_list = await votes.sort(function(a, b) { 
            return Math.abs(b.rshares) - Math.abs(a.rshares);
        });
	
        //voter_list.sort((a, b) => parseFloat(a.rshares) - parseFloat(b.rshares));
	
        voter_list = voter_list.slice(0, 10);
	
        var v_list = voter_list.map(function(voter_list) { 
            if(Number(voter_list.rshares) < 0) return "-" + voter_list.voter;
            return "+" + voter_list.voter;
        });
	
        v_list = v_list.join(" <br/> ");
        if(votes.length > 10) v_list = v_list + " <br/> and more.";
        
        return v_list;
	
    },
	
	check_cash: function(pst) {
		return Math.max(Number(pst.pending_payout_value.split(' ')[0]), Number(pst.total_payout_value.split(' ')[0]) + Number(pst.curator_payout_value.split(' ')[0])).toLocaleString();
	},
	
	link_images: function(text){
		text.replace(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif)(?!["\)]))/gi, image => {
			return '<img src="' + image + '">' + '<br/>';
		});
	},
	
	link_issues: function(text) {
		text.replace(/(^|\s)(#[-a-z\d]+)/gi, tag => {
			if (/#[\d]+$/.test(tag)) return tag; // Don't allow numbers to be tags
			const space = /^\s/.test(tag) ? tag[0] : '';
			const tag2 = tag.trim().substring(1);
			const tagLower = tag2.toLowerCase();
			return space + '<a target="_blank" href="https://steemit.com/trending/' + tagLower + ' ">' + tag + ' </a>';
		});
	},
		
	link_mentions: function(text){
		text.replace(
			/(^|[^a-zA-Z0-9_!#$%&*@＠\/]|(^|[^a-zA-Z0-9_+~.-\/#]))[@＠]([a-z][-\.a-z\d]+[a-z\d])/gi,
			(match, preceeding1, preceeding2, user) => {
				const userLower = user.toLowerCase();
				const valid = validate_account_name(userLower) == null;

				const preceedings = (preceeding1 || '') + (preceeding2 || ''); // include the preceeding matches if they exist

				return valid
					? preceedings + '<a target="_blank" href="/user/' + userLower + '">@' + user + '</a>' : preceedings + '@' + user;
			}
		);	
	
	},
	
	link_urls: function(text) {
  
		return (text || "").replace(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi, function(match, space, url){
			var hyperlink = url;
			if (!hyperlink.match('^https?:\/\/')) {
				hyperlink = 'http://' + hyperlink;
			}			
			return space + '<a href="' + hyperlink + '">' + url + '</a>';
		});
			
	},
	
}


