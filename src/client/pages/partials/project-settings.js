    
$( window ).on( 'load', function() {
	
    var Editor = require('../../../lib/editor'),
        config = require('../../../configs/config');
    
    window.Editor = Editor;
    
    Editor.disable_image_upload();
    
    //jquery is already universal through the `scripts.js` global file

    $('#updateBtn').on('click', function() {
	
        if (validateForm() == true) {
            post();
            $('form').addClass('loading');
            $( '#' + this.id).addClass('disabled');
        }
		
    });
	
	
    var data = {};
	
    function validateForm() {
		
        data.slug = project_slug;
        data.name = $('#projectName').val();
        data.location = $('#projectLocation').val();
        //data.founder = active_user; //handled server side for thorough consistency
        data.logo = $('#projectLogo').val();
        data.cover = $('#projectCover').val();
        data.description = $('#projectDescription').val().substring(0, 160);
        data.mission = $('#projectMission').val().substring(0, 160);
        data.story = Editor.setup.getValue();
        //data.state = $('#projectState').dropdown('get value');
        data.state = $('#projectState').find(':selected').text();
        data.tag = $('#projectTag').val();
        data.website = $('#projectWebsite').val();
        data.website = (data.website.indexOf('://') === -1) ? 'http://' + data.website : data.website;
        data.steem = $('#projectSteem').val();
        data.facebook = $('#projectFacebook').val();
        data.twitter = $('#projectTwitter').val();
        data.github = $('#projectGithub').val();
        data.chat = $('#projectChat').val();
		
        var required = [ data.name, data.description, data.state, data.tag ];
        var empty = '';
        var invalid = required.indexOf(empty);
		
		
        if (invalid > -1 ) {
			
            var name = '';
            var id = '';
            var field = '';
			
            if (invalid == 0) {name = 'Name field'; id = 'projectName', field = 'nameField';}
            if (invalid == 1) {name = 'Description field'; id = 'projectField', field = 'descriptionField';}
            if (invalid == 2) {name = 'State field'; id = 'projectState', field = 'stateField';}
            if (invalid == 3) {name = 'Tag field'; id = 'projectTag', field = 'tagField';}
			
            alert(name + ' cannot be empty');
            $('#' + id).focus();
            $('#' + field).addClass('error');
			
            return false;
			
        } else if (data.story == '') {	//cannot enter empty body
            alert('Please enter story of your project.');
            return false;
        } else {
			
            return true;
			
        }
		
    }
	
	
    async function post() {
		
        try {
			
            var status = await Promise.resolve($.post('/api/private/update/project', data ));
            //console.log(status);
            window.location.href = '/project/' + status;
			
        } catch (err) {
            console.log(err);
            alert('Sorry, an error occured. Please again');
            window.location.reload();
        }
		
    }	
	
    $('.limitedText').on('keyup',function() {
        var maxLength = $(this).attr('maxlength');
        if (maxLength == $(this).val().length) {
            alert('You can\'t write more than ' + maxLength + ' characters');
        }
    });
		
		
		
    (async() => {
			
        try {
			
            var response = await Promise.resolve($.get('/api/private/project/' + project_slug + '/settings' ));
            $('#settings-loader').hide();
            $('#settings-form').show();
            $('#updateBtn').show();
				
            response = response[0];
				
            $('#projectName').val(response.name);
            $('#projectLocation').val(response.location);
            $('#projectLogo').val(response.logo);
            $('#projectCover').val(response.cover);
            $('#projectDescription').val(response.description);
            $('#projectMission').val(response.mission);
            //$('#edito').val(response.story);
				
            Editor.setup.setHtml(Editor.setup.convertor.toHTML(response.story));
                
            $('#projectState').val(response.state.toLowerCase()).change();
            $('#projectTag').val(response.tag);
            $('#projectWebsite').val(response.website);
            $('#projectSteem').val(response.steem);
            $('#projectFacebook').val(response.facebook);
            $('#projectTwitter').val(response.twitter);
            $('#projectGithub').val(response.github);
            $('#projectChat').val(response.chat);
				
            //console.log(response);
			
        } catch (err) {
            console.log(err);
            alert('Sorry, an error occured. Please again');
            window.location.reload();
        }
			
    })();
		
});
	
  