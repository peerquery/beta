
'use strict';

const $ = require('jquery');
window.jQuery = $;
window.$ = $;

require('semantic-ui-css/semantic.min.js');

const pqy_notify = require('./notify');
const auth = require('./auth');
const consoler = require('./console');
const compactibility = require('./compactibility');
const miscellaneous = require('./miscellaneous');
const listeners = require('./listeners');
const semantic_ui = require('./semantic_ui');

window.pqy_notify = pqy_notify;

$(document).ready(function() {
    
    semantic_ui();
    auth();
    listeners();
    consoler.warn();
    miscellaneous();
    
    if (!compactibility.cookie_terms()) pqy_notify.inform('We use cookies to ensure you get the best experience. By using our website you agree to our <a href="/privacy-policy" target="_blank">Privacy Policy</a>. <a class="cookie_consent" href="javascript:void(0)" style="margin-right:10px; margin-left:10px"><b>Got it</b></a>');    
    if (!compactibility.es6()) pqy_notify.persist('You are using an unsupport broswer. Please upgrade or change your broswer.');
    if (!compactibility.enable_cookies()) pqy_notify.persist('Cookies are turned off in your browser. Some features would not work.');
    if (!compactibility.webstorage()) pqy_notify.persist('WebStorage is not supported in your browser. Some features would not work.');
    
});

	