
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
		
			$('#account_img').attr("src", "https://steemitimages.com/u/" + active_user + "/avatar");
			
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
				placeholder: 'Prepare your post here...',
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
		
		
		
			function publish() {
		
				//console.log(quill.root.innerHTML)
				//publish function goes here
				
				var project_title;
				
				const project_slug_id = $('#projectSelect').find(":selected").val();
				
				if (project_slug_id !== '') {
					project_title = user_projects.filter(e => e.slug === project_slug_id)[0].title;
				} else {
					project_title = '';
				}
				
				const title = document.getElementById('post-title').value;
				if (title == "") { alert('Enter title'); document.getElementById('post-title').focus(); return };
			
				const body = quill.root.innerHTML;
				if (body == "<p><br></p>") { alert('Enter post body'); return; };
			
				const author = active_user;
				const category = "peerquery";
				var link = title.replace(/\W+/g, " ");
				var permlk = link.replace(/\s+/g, '-');
				var plink = permlk.toLowerCase();
				var permlink = plink.replace(/^[^a-z\d]*|[^a-z\d]*$/gi, '');
			
				var tagStr = document.getElementById('post-tags').value;
				if (tagStr == "") { alert("Enter atleast one tag"); document.getElementById('post-tags').focus(); return;} ;
			
				var tagStrg = tagStr.toLowerCase();
				//var tagStrng = tagStrg.replace(/^[^a-z\d]*|[^a-z\d]*$/gi, '');
				var tagString = tagStrg.replace(/\W+/g, " ");
				var tags = tagString.split(" ", 3);
				tags.unshift(category);
			
				document.getElementById('form').className = "ui loading form";
				$('#publish').addClass('disabled');
			
				var n = title.length;
			
				if(n == 1) {
					alert("Please enter a longer title!");
					document.getElementById('form').className = "ui form";
					document.getElementById('form').className = "ui form";
					$('#publish').removeClass('disabled');
					return;
				};
			
				function test_permlink() {
		
					client.database.call('get_content', [author, permlink]).then(result => {
						//console.log(result);
						
						n = n -1;
					
						if (result.author != "")  {
						
							var ttle= title.substr(0, n);
							link = ttle.replace(/\W+/g, " ");
							permlk = link.replace(/\s+/g, '-');
							plink = permlk.toLowerCase();
							permlink = plink.replace(/^[^a-z\d]*|[^a-z\d]*$/gi, '');
							
							test_permlink();
							return;
						
						} else {
							do_publish(category, author, permlink, title, body, tags, project_slug_id, project_title);
						}
					
					});
			
				}	
			
				test_permlink();
			
			
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
								window.location.href = "/@" + author + "/" + permlink;
							}
							
							window.location.href = "/@" + author + "/" + permlink;
					
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

