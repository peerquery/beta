
'use strict';

const config = require('../../configs/config');

(async () => {
	
    try {
		
        var sc2_url = 'https://v2.steemconnect.com/oauth2/authorize?client_id=' +
			//"peerquery.app" +
			config.sc2_app_name +
			'&redirect_uri=http%3A%2F%2F' + window.location.hostname + '%2Flogin' +
			//"&scope=vote,comment,custom_json" +
			'&scope=' + config.sc2_scope +
			'&state=%2F' + window.location.pathname.substring(1);
	
        document.getElementById('loginBtn').href = sc2_url;
	
        //check is the window has sc2 data hash
        if (new URLSearchParams(document.location.search).get('access_token')) {
			
            $('form').addClass('loading');
			
            //check is session storage is supported or not. if not - alert the user that their browser is NOT supported
            if (typeof(Storage) == 'undefined') {
                alert('Sorry your browser is NOT supported. Please upgrade or switch to a modern broswer.');
                window.location.href = '/';
            }
	
	
            // set acquire access_token, expires_in and username into object
            let auth_obj = {};
            auth_obj.access_token = new URLSearchParams(document.location.search).get('access_token'),
            auth_obj.username = new URLSearchParams(document.location.search).get('username'),
            auth_obj.expires_in = new URLSearchParams(document.location.search).get('expires_in');
			
            //store tokens access_token in session storage
            sessionStorage.access_token = auth_obj.access_token;
		
            var redirect_uri = new URLSearchParams(document.location.search).get('state');
	
            //clear sc2 hash
            window.history.replaceState('', document.title, window.location.pathname);
	
            //send details to auth api
            var response = await Promise.resolve($.post('/api/login', auth_obj ));
            //console.log(response);
            
            //redirect user to their previous page after successful log in
            if (redirect_uri == window.location.pathname.substring(1)) {
                window.location.href = '/peer/' + active_user;
            } else {
                window.location.href = redirect_uri;
            }
			
		
        } else if (window.sessionStorage.access_token && !(new URLSearchParams(document.location.search).get('access_token'))){
            //if user is on /login page but does not have the sc2 auth query string yet is logged in, safely send them home
            window.location.href = '/';
        }
	
    } catch (err){
        console.log(err);
        alert('Sorry, error logging you in. Please try again.');
        window.location.href = redirect_uri || '/';
    }
	
	
})();