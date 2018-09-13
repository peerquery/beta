
'use strict';

var sc2 = require('sc2-sdk'),
	dsteem = require('dsteem'),
	config = require('../../configs/config'),
	client = new dsteem.Client(config.steem_api),
	Quill = require('quill');
	
	//jquery is already universal through the `ui.js` global file
	
$( window ).on( "load", function() {
	
	var user_projects;
	
	(async () => {
		try {
			
			const access_token = await Promise.resolve(sessionStorage.access_token);
		
			if(!access_token || access_token == '') { alert('Sorry, no auth tokens. Please login and try again.'); window.location.href = '/login' };
			
			let steem_api = sc2.Initialize({
				app: config.sc2_app_name,
				callbackURL: window.location.href,
				accessToken: access_token,
				scope: config.sc2_scope_array
			});
		
			//$('#account_img').attr("src", "https://steemitimages.com/u/" + active_user + "/avatar");
			
			var toolbarOptions = [
				['bold', 'italic', 'underline', 'strike'],        // toggled buttons
				['blockquote', 'code-block', 'link', 'image'],
			
				[{ 'header': 1 }, { 'header': 2 }],               // custom button values
				[{ 'list': 'ordered'}, { 'list': 'bullet' }],
				[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
				[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
				[{ 'direction': 'rtl' }],                         // text direction
			
				[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
				[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			
				[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
				[{ 'font': [] }],
				[{ 'align': [] }],
		
				['clean']                                         // remove formatting button
			];
		
		
			var quill = new Quill('#editor', {
				modules: {
					toolbar: toolbarOptions
					},
				placeholder: 'Prepare your query here...',
				theme: 'snow'
			});
		
		
			var toolbar = quill.getModule('toolbar');
			toolbar.addHandler('image', function() {

				var range = this.quill.getSelection();
				var value = prompt('What is the image URL');
				this.quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
	
			});
		
	
			$('#publish').on('click', function() {
			
				publish();
			
			})
		
		
			async function publish() {
		
				//console.log(quill.root.innerHTML)
				//publish function goes here
				
				var project_title;
				
				const project_slug_id = $('#projectSelect').find(":selected").val();
				
				if (project_slug_id !== '') {
					project_title = user_projects.filter(e => e.slug === project_slug_id)[0].title;
				} else {
					project_title = '';
				}
				
				const title = document.getElementById('query-title').value;
				if (title == "") { alert('Please enter title'); document.getElementById('query-title').focus(); return };
				
				const image = document.getElementById('queryImage').value;
				if (image == "") { alert('Please enter image'); document.getElementById('queryImage').focus(); return };
				
				const description = document.getElementById('queryDescription').value;
				if (description == "") { alert('Please enter description'); document.getElementById('queryDescription').focus(); return };
				
				const body = quill.root.innerHTML;
				if (body == "<p><br></p>") { alert('Please enter query body'); return; };
			
			
				const telephone = document.getElementById('queryTelephone').value;
				if (telephone == "") { alert('Please telephone'); document.getElementById('queryTelephone').focus(); return };
			
				const email = document.getElementById('queryEmail').value;
				if (email == "") { alert('Please enter email'); document.getElementById('queryEmail').focus(); return };
			
				var website = document.getElementById('queryWebsite').value;
				if (website == "") { alert('Please enter website'); document.getElementById('queryWebsite').focus(); return };
				website = (website.indexOf('://') === -1) ? 'http://' + website : website;
			
				const terms = document.getElementById('queryTerms').value;
				if (terms == "") { alert('Please enter terms'); document.getElementById('queryTerms').focus(); return };
			
				const type = document.getElementById('queryType').value;
				if (type == "") { alert('Please enter type'); document.getElementById('queryType').focus(); return };
			
				const label = document.getElementById('queryLabel').value;
				if (label == "") { alert('Please enter label'); document.getElementById('queryLabel').focus(); return };
			
				//const deadline = document.getElementById('queryDeadline').value;		//deadline is assigned from the script on the page itself
				if (deadline == "") { alert('Please enter deadline'); document.getElementById('queryDeadline').focus(); return };
			
				const reward = Number(document.getElementById('queryReward').value) || 0;
				if (reward == "") { alert('Please enter reward in numeric form'); document.getElementById('queryReward').focus(); return };
			
				const reward_form = document.getElementById('queryRewardForm').value;
				if (reward_form == "") { alert('Please enter reward form'); document.getElementById('queryRewardForm').focus(); return };
			
			
				const author = active_user;
				const category = "peerquery";
				var link = title.replace(/\W+/g, " ");
				var permlk = link.replace(/\s+/g, '-');
				var plink = permlk.toLowerCase();
				var permlink = plink.replace(/^[^a-z\d]*|[^a-z\d]*$/gi, '');
				permlink = permlink + "-0" + String(new Date().getTime()).substr(-8);
			
				var tagStr = document.getElementById('query-tags').value;
				if (tagStr == "") { alert("Please enter atleast one tag"); document.getElementById('query-tags').focus(); return;} ;
			
				var tagStrg = tagStr.toLowerCase();
				//var tagStrng = tagStrg.replace(/^[^a-z\d]*|[^a-z\d]*$/gi, '');
				var tagString = tagStrg.replace(/\W+/g, " ");
				var tags = tagString.split(" ", 3);
				tags.unshift(category);
			
				if(title.length < 5) { alert("Please enter a longer title!"); return;	};
				
				document.getElementById('form').className = "ui loading form";
				$('#publish').addClass("disabled");
			
				do_publish(category, author, permlink, title, body, tags, project_slug_id, project_title, terms, email, telephone, website, reward, reward_form, label, type, deadline, image, description);
				
			
			}
		
		
			function do_publish(category, author, permlink, title, body, tags, project_slug_id, project_title, terms, email, telephone, website, reward, reward_form, label, type, deadline, image, description) {
			
				steem_api.comment(
			
					'', // author, leave blank for new query
					category, // first tag
					author, // username
					permlink, // permlink
					title, // Title
					body, // Body of query
					{ tags: tags, app: 'peerquery' },// json metadata (additional tags, app name, etc)
					
					
					async function (err, results) {
				
						if (err) {
						
							var nErr = JSON.stringify(err.error_description);
							//console.log(nErr);
			
							if (nErr.indexOf("The comment is archived") > -1)
								return alert("Post with the same permlink already exists and is archived, please change your permlink.");
						
							if (nErr.indexOf("You may only post once every 5") > -1)
								return alert("You may only post once every five minutes!");
						
							return;
				
							//throw err;
							alert('Failure! ' + err);
							document.getElementById('form').className = "ui form";
					
						} else {
						
							//console.log('Success!', results);
							//now ping the server with update
							
							try{
							
								var data = {};
								//data.steemid = results.result.id;
								data.steemid = 6768679;
								if(project_slug_id !== '') data.project_slug_id = project_slug_id;
								if(project_title !== '') data.project_title = project_title;
								data.title = title;
								data.category = category;
								data.body = body;
								data.permlink = permlink;
								
								data.terms = terms;
								data.telephone = telephone;
								data.email = email;
								data.website = website;
								data.reward = reward;
								data.reward_form = reward_form;
								data.label = label;
								data.type = type;
								data.deadline = deadline;
								data.image = image;
								data.description = description;
								
							
								var status = await Promise.resolve($.post("/api/private/create/query", data ));
								//console.log(status);
							
							} catch(err) {
								console.log(err);
								alert('Sorry, an error occured updating the server. However, the query has been successfully published to your Steem account.');
								window.location.href = "/query/" + permlink;
							}
							
							window.location.href = "/query/" + permlink;
					
						}
					
					
					}
				
				);
		
			}
	
		
			(async function() {
				
				$.getJSON("/api/private/projects/list", null, function(data) {
					
					user_projects = data;
					
					//$("#projectSelect option").remove(); // Remove all <option> child tags.
					
					$("#projectField").removeClass('disabled');
					
					$.each(data, function(index, item) { // Iterates through a collection
						$("#projectSelect").append( // Append an object to the inside of the select box
						$("<option></option>") // Yes you can do this.
							.text(item.name)
							.val(item.slug)
						);
					});
				
				});
			
			})()
		
		
		} catch(err){
		
			alert('Sorry, an err occured. Please login and try again.');
			console.log(err);
			window.location.href = '/login';
		
		}
	
	})()

	
		$(".limitedText").on("keyup",function() {
			var maxLength = $(this).attr("maxlength");
			if(maxLength == $(this).val().length) {
				alert("You can't write more than " + maxLength +" characters")
			}
		});
		
		
	
})

