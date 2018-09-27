'use strict';

module.exports = {
    es6: function() {
        try {
            new Function('(a = 0) => a');
            return true;
        } catch (err) {
            return false;
        }
    },
    enable_cookies: function() {
        return navigator.cookieEnabled;
    },
    webstorage: function() {
        if (typeof Storage !== 'undefined') return true;
        else return false;
    },
    cookie_terms: function() {
        if (document.cookie.indexOf('cookie_reminder') == -1) return false;
        else return true;
    },
};
