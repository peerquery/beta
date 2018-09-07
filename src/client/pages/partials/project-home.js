
	$( window ).on( "load", function() {
		async function get() {
		
			try{
			
				var response = await Promise.resolve($.get("/api/project/" + project_slug + "/home" ));
				$('#home-loader').hide();
				$('#home-content').html(response[0].story);
				//console.log(response);
			
			} catch(err) {
				//console.log(err);
				alert('Sorry, an error occured. Please again');
				//window.location.reload();
			}
		
		}	
		
		get();
		
	});
	
	