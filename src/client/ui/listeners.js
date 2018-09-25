'use strict';

module.exports = function() {
    
    $('#notifications-container')
        .on('click', '.cookie_consent', function(event){
            $(this).hide();
            var d = new Date();
            d.setTime(d.getTime() + ( 7 * 24 * 60 * 60 * 1000 )); //7 days
            var expires = 'expires=' + d.toUTCString();
            document.cookie = 'cookie_reminder' + '=' + new Date().toDateString() + ';' + expires + ';path=/';
        })
        .on('click', '.message .close', function() {//listener for notifications message close icon click
            $(this).closest('.message').transition('fade');
        });
        
};