
'use strict';

var sc2 = require('sc2-sdk'),
    Editor = require('../../lib/editor'),
	config = require('../../configs/config');
    
	//jquery is already universal through the `scripts.js` global file

$( window ).on( "load", function() {
	
	var user_projects;
	
	(async () => {
		try {
		
			const access_token = await Promise.resolve(sessionStorage.access_token);
		
			if(!active_user || active_user === '') { alert('Sorry not logged in. Please login and try again.'); window.location.href = '/login' };
			
			let steem_api = sc2.Initialize({
				app: config.sc2_app_name,
				callbackURL: window.location.href,
				accessToken: access_token,
				scope: config.sc2_scope_array
			});
		
			//$('#account_img').attr("src", "https://steemitimages.com/u/" + active_user + "/avatar");
			
            Editor.disable_image_upload();
            
			$('#publish').on('click', function() {
				publish();
			})
		
		
			function publish() {
            
				//publish function goes here
				
				var project_title;
				
				const project_slug_id = $('#projectSelect').find(":selected").val();
				
				if (project_slug_id !== '') {
					project_title = user_projects.filter(e => e.slug === project_slug_id)[0].title;
				} else {
					project_title = '';
				}
				
				const title = document.getElementById('post-title').value;
				if (title == "") { alert('Please enter title'); document.getElementById('post-title').focus(); return };
			
				const author = active_user;
				const category = $('#reportCategory').find(":selected").val();
                
                const tlink = title.replace(/\W+/g, " ").replace(/\s+/g, '-').replace(/^[^a-z\d]*|[^a-z\d]*$/gi, '').toLowerCase();
				const permlink = author + "-" + tlink + "-" + (Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
			
				const body = Editor.setup.getValue() + config.report_attribution.replace(/URL/g, config.site_uri + "/report/" + permlink);
				if (body == "") { alert('Please enter post body'); return; };
			
				const tagString = document.getElementById('post-tags').value.replace(/\W+/g, " ").toLowerCase();
				if (tagString == "") { alert("Please enter atleast one tag"); document.getElementById('post-tags').focus(); return;} ;
			
				var tags = tagString.split(" ", 3);
				tags.unshift(category);
			
				if(title.length < 5) { alert("Please enter a longer title!"); return;	};
				
				document.getElementById('form').className = "ui loading form";
				$('#publish').addClass("disabled");
				
                
				do_publish(category, author, permlink, title, body, tags, project_slug_id, project_title);
				
			
			}
		
		
			function do_publish(category, author, permlink, title, body, tags, project_slug_id, project_title) {
			
				steem_api.comment(
			
					'', // author, leave blank for new post
					category, // first tag
					author, // username
					permlink, // permlink
					title, // Title
					body, // Body of post
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
								data.steemid = results.result.id;
								if(project_slug_id !== '') data.project_slug_id = project_slug_id;
								if(project_title !== '') data.project_title = project_title;
								data.title = title;
								data.category = category;
								data.body = body;
								data.permlink = permlink;
							
								var status = await Promise.resolve($.post("/api/private/create/report", data ));
								//console.log(status);
							
							} catch(err) {
								console.log(err);
								alert('Sorry, an error occured updating the server. However, the report has been successfully published to your Steem account.');
								window.location.href = "/report/" + permlink;
							}
							
							window.location.href = "/report/" + permlink;
					
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

})

