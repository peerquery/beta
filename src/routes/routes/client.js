
'use strict';

var router = require('../../server/router'),
    address = require('../indexes/address'),
    authorize = require('../auth/authorize'),
    cookie = require('cookie-parser');
	
module.exports = function(app) {
	
    app.get('/login', function (req, res) {
        if (req.active_user) return res.redirect('/@' + req.active_user.account);
        return router(address.client.login, req, res);
    });
	
    app.get('/create/report', authorize, function (req, res) {
        return router(address.client.new_report, req, res);
    });
	
    app.get('/create/query', authorize, function (req, res) {
        return router(address.client.new_query, req, res);
    });
	
    app.get('/create/project', authorize, function (req, res) {
        return router(address.client.new_project, req, res);
    });
	
    app.get('/logout', function (req, res) {
        res.clearCookie('_auth').redirect('/');
    });

};
