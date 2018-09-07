
'use strict';
		
//import $ from 'jquery';
//window.jQuery = $;
//window.$ = $;

module.exports = function() {
	
	$( "#item-container" ).on('click', '.pop', function() {
		var el = this;
	
		jQuery('.ui.modal').modal('show');
	
		$('.ui.modal')
			.modal({
			onShow    : function(){
				//window.alert('Showing modal!!!');
				//console.log(this); //works but rather only logs the real modal itself!
				document.getElementById('modal_href').href = "/@" + el.dataset.account + "/" + el.dataset.permlink;
				document.getElementById('modal_title').innerHTML = el.dataset.title;
				document.getElementById('modal_author').innerHTML = "@" + el.dataset.account;
				document.getElementById('modal_content').innerHTML = el.dataset.body;
				return false;
			}
		}).modal('show');
	
	});

}
