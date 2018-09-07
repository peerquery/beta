
var dsteem = require('dsteem'),
	create = require('./../../../src/lib/content-creator'),
	client = new dsteem.Client('https://api.steemit.com'),
	timeago = require("timeago.js"),
	timeagoInstance = timeago();
	

var path = "/trending/";


function display(type) {
	path = "/" + type + "/";
	getState(path);
}


async function getState(path) {
	
	try {
		document.getElementById('witness-area').style.display = "none";
		document.getElementById('post-loader').style.display = "block";
		document.getElementById("item-container").innerHTML = "";

		var result = await client.database.getState(path); 
		document.getElementById("post-loader").style.display = "none";
	
		document.getElementById("block").innerText = "#" + result.props.head_block_number;
		document.getElementById("version").innerText = result.witness_schedule.majority_version;
	
		document.getElementById('witness-href').href = "/@" + result.props.current_witness;
		document.getElementById('witness_img').src = "https://img.busy.org/@" + result.props.current_witness;
		document.getElementById('witness').innerText = result.props.current_witness.toUpperCase();
		document.getElementById('sbd').innerText = result.feed_price.base;
		document.getElementById('witness-area').style.display = "block";
			
			
			
		var process = async (result, path) => {
		
			contents = result.content;
		
			var n = "";
  
			if(path == "/trending/") var sort = result.discussion_idx[n].trending;
			if(path == "/created/") var sort = result.discussion_idx[n].created;
			if(path == "/hot/") var sort = result.discussion_idx[n].hot;
			if(path == "/promoted/") var sort = result.discussion_idx[n].promoted;
		
			var data = [];
	
			for (var x in sort) {
				var i = sort[x];
				var info = contents[i];
				data.push(info);
			}
  
			return data;
		}
	
		var results = await process(result, path);
		
		for (var x in results) {
			var post = await create.post(results[x]);
			document.getElementById("item-container").appendChild(post);
		}
		document.getElementById("post-loader").style.display = "none";
    
	} catch(err){
		console.log(err);
	}

}

(async () => {
	try {
		var result = await client.database.call('get_trending_tags', [, 41]);
		for (var x in result) {
			if (x == 0) continue;
			var tag = await create.tag(result[x], x);
			document.getElementById("tags-container").appendChild(tag);
		}
		document.getElementById("tags-loader").style.display = "none";
		document.getElementById("tags-label").style.display = "block";
	} catch(err){
		console.log(err);
	}
})();


$('#trending').on('click', function() {
	display('trending');
})

$('#created').on('click', function() {
	display('created');
})

$('#hot').on('click', function() {
	display('hot');
})

$('#promoted').on('click', function() {
	display('promoted');
})


getState(path);

