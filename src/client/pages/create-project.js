
'use strict';
	
	//jquery is already universal through the `ui.js` global file
		
		//$('#account_img').attr("src", "https://steemitimages.com/u/" + active_user + "/avatar");
		$('#projectFounder').val(active_user);
	
		$('#createBtn').on('click', function() {
	
			if(validateForm() == true) {
				post();
				$('form').addClass('loading');
				$( '#' + this.id).addClass('disabled');
			};
		
		});
	
	
		var data = {};
	
		function validateForm() {
		
			data.name = $('#projectName').val();
			data.location = $('#projectLocation').val()
			//data.founder = active_user; //handled server side for thorough consistency
			data.logo = $('#projectLogo').val();
			data.cover = $('#projectCover').val();
			data.description = $('#projectDescription').val().substring(0, 160);
			data.title = $('#projectTitle').val().substring(0, 100);
			data.mission = $('#projectMission').val().substring(0, 160);
			data.story = $('#projectStory').val();
			data.state = $('#projectState').find(":selected").val().toLowerCase();
			data.tag = $('#projectTag').val();
			data.website = $('#projectWebsite').val();
			data.website = (data.website.indexOf('://') === -1) ? 'http://' + data.website : data.website;
			data.steem = $('#projectSteem').val();
			data.facebook = $('#projectFacebook').val();
			data.twitter = $('#projectTwitter').val();
			data.github = $('#projectGithub').val();
			data.chat = $('#projectChat').val();
		
			var required = [ data.name, data.description, data.title, data.story, data.state, data.tag ];
			var empty = '';
			var invalid = required.indexOf(empty);
		
		
			if(invalid > -1 ) {
			
				var name = '';
				var id = '';
				var field = '';
			
				if(invalid == 0) {name = 'Name field'; id = 'projectName', field = 'nameField'};
				if(invalid == 1) {name = 'Description field'; id = 'projectDescription', field = 'descriptionField'};
				if(invalid == 2) {name = 'Title field'; id = 'projectTitle', field = 'titleField'};
				if(invalid == 3) {name = 'Story field'; id = 'projectStory', field = 'storyField'};
				if(invalid == 4) {name = 'State field'; id = 'projectState', field = 'stateField'};
				if(invalid == 5) {name = 'Tag field'; id = 'projectTag', field = 'tagField'};
			
				alert(name + ' cannot be empty');
				$('#' + id).focus();
				$('#' + field).addClass('error');
			
				return false;
			
			} else {
			
				if(data.story.length / Math.pow(1024,1) > 10) {	//greater than 10kb
					alert('Story size cannot be more than 10kb.');
					$('#projectStory').focus();
					$('#storyField').addClass('error');
					return;
					
				} else {
					return true;
				}
				
			};
		
		}
	
	
		async function post() {
		
			try{
			
				var status = await Promise.resolve($.post("/api/private/create/project", data ));
				//console.log(status);
				window.location.href = '/project/' + status;
			
			} catch(err) {
				console.log(err);
				alert('Sorry, an error occured. Please again');
				window.location.reload();
			}
		
		}	
	
		$(".limitedText").on("keyup",function() {
			var maxLength = $(this).attr("maxlength");
			if(maxLength == $(this).val().length) {
				alert("You can't write more than " + maxLength +" characters")
			}
		});
		
		
	