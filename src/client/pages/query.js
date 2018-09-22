
'use strict';

var parser = require('../../lib/post-parser-web');

//jquery is already universal through the `ui.js` global file
    
    
(async () => {
	
    try {
        
        $('#body').html(parser.content( $('#temp').html() ));
        $('#temp').remove();
        
    } catch (err){
        console.log(err);
    }
    
    
})();


