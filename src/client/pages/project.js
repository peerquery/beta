
'use strict';
	
	
	var jdenticon = require("jdenticon");
	
	
	$('#home').attr('href' , '/project/' + project_slug);
	$('#reports').attr('href' , '/project/' + project_slug + '/reports');
	$('#members').attr('href' , '/project/' + project_slug + '/members');
	$('#settings').attr('href' , '/project/' + project_slug + '/settings');
			
	if(!project_logo) {
	
		var size = 150,
		value = project_slug,
		svg = jdenticon.toSvg(value, size);
		
		$('#project-logo-div').html(svg);
		
		
	}
		