const $ = require('jquery');
window.jQuery = $;
window.$ = $;
require('semantic-ui-css/semantic.min.js');

const config = require(__dirname + './../../configs/config');


//TODO--------break up parts/systems into separate modules

$(document).ready(function() {
    
    //----------auth system
    
    const login_url = 'https://v2.steemconnect.com/oauth2/authorize?client_id=' +
			//"peerquery.app" +
			config.sc2_app_name +
			'&redirect_uri=http%3A%2F%2F' + window.location.hostname + '%2Flogin' +
			//"&scope=vote,comment,custom_json" +
			'&scope=' + config.sc2_scope +
			'&state=%2F' + window.location.pathname.substring(1);
			
    //initialize auth system
	
    (async () => {
		
        //check is session storage is supported or not. if not - alert the user that their browser is NOT supported
        if (typeof(Storage) == 'undefined') { alert('Sorry your browser is NOT supported. Please upgrade or switch to a modern broswer.'); return; }
	
        //check to see if user is logged in. if not exist, else continue
        if (!active_user || active_user == '') return;
	
        //check if access_token exists in session storage. if yes, return the value and exists. else continue
        if (sessionStorage.access_token) { const access_token = sessionStorage.access_token; /*return access_token;*/ return; }
	
        //if not, ping server for decrypted access_token. use key to decrypt data. store decrypted data in session storage
        try {
		
            const auth = await Promise.resolve($.get('/api/private/auth' ));
            //console.log(access_token);
            sessionStorage.access_token = auth.access_token;
		
        } catch (err) {
            console.log(err);
            alert('Sorry, could not auth your account. Consider signing in again');
            window.location.href = '/login';
        }
	
    })();
			
			
    $('#navbarLoginButton').attr('href', login_url);
	
    $('.ui.menu .ui.dropdown').dropdown({
        on: 'hover'
    });
	
    $('.ui.menu a.item').on('click', function() {
        $(this)
            .addClass('active')
            .siblings()
            .removeClass('active');
    });

    $('.ui.menu .ui.dropdown').dropdown({on: 'hover'});
	
    $('.ui.menu a.item').on('click', function() {
        $(this)
            .addClass('active')
            .siblings()
            .removeClass('active');
    });
	
    $('.ui.dropdown').dropdown();
	
    
    
    
	
    //------------post preview popup system
	
    $( '#item-container' ).on('click', '.pop', function() {
        var el = this;
	
        jQuery('.ui.modal').modal('show');
	
        $('.ui.modal')
            .modal({
                onShow    : function(){
                    //window.alert('Showing modal!!!');
                    //console.log(this); //works but rather only logs the real modal itself!
                    document.getElementById('modal_href').href = '/@' + el.dataset.account + '/' + el.dataset.permlink;
                    document.getElementById('modal_title').innerHTML = el.dataset.title;
                    document.getElementById('modal_author').innerHTML = '@' + el.dataset.account;
                    document.getElementById('modal_content').innerHTML = el.dataset.body;
                    return false;
                }
            }).modal('show');
	
    });
	
    
    //-----image not found system
    
    $('img').each(function() {
        if (!this.complete || typeof this.naturalWidth == 'undefined' || this.naturalWidth == 0) {
            // image was broken, replace with your new image
            this.src = '/assets/images/placeholder.png';
        }
    });
	
    
    //--------logged in manager system
    if (active_user !== '') {//logged in
        $('#loggedin-desktop-options').show();
        $('#loggedin-desktop-create').show();
        $('#logged_in_user_href').attr('href', '/peer/' + active_user);
    } else { //not logged in
        $('#loggedin-desktop-options').hide();
        $('#navbarLoginButton').show();
        $('#signupButton').show();
    }
	
    var path = window.location.pathname;
    if (path == '/projects') document.getElementById('projects-page').classList.add('navbar-active');
    if (path == '/queries') document.getElementById('queries-page').classList.add('navbar-active');
    if (path == '/reports') document.getElementById('reports-page').classList.add('navbar-active');
    if (path == '/peers') document.getElementById('peers-page').classList.add('navbar-active');
    if (path == '/steem') document.getElementById('steem-page').classList.add('navbar-active');
	
    //--------console warn system
    console.log('%cSTOP! PROCEED WITH CAUTION!', 'color: red; font-size: 30px; font-weight: bold;');
    console.log('%cThis is the developer console!!!', 'color: red; font-size: 20px; font-weight: bold;');
    console.log('%cANY ACTIVITY HERE COULD POTENTIALLY COMPROMISE YOUR ACCOUNT!!!', 'color: red; font-size: 20px; font-weight: bold;');

});

	