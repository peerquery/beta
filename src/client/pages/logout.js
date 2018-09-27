'use strict';

const config = require('../../configs/config');
const sc2 = require('steemconnect');

let steem_api = sc2.Initialize({
    app: config.sc2_app_name,
    callbackURL: window.location.href,
    accessToken: sessionStorage.access_token,
    scope: config.sc2_scope_array,
});

steem_api.revokeToken(function(err, res) {
    console.log(err, res);
    sessionStorage.clear();
    window.location.href = '/';
});
