'use strict';

var router = require('../../server/router'),
    address = require('../indexes/address'),
    authorize = require('../auth/authorize'),
    peers = require('../../models/peer');

module.exports = function(app) {
    app.get('/login', function(req, res) {
        if (req.active_user)
            return res.redirect('/@' + req.active_user.account);
        return router(address.client.login, req, res);
    });

    app.get('/create/report', authorize, async function(req, res) {
        var find = { account: req.active_user.account };
        var peer = await peers
            .findOne(find)
            .select('beneficiaries_count beneficiaries_percentage ');

        res.req_data = peer;

        return router(address.client.new_report, req, res);
    });

    app.get('/create/query', authorize, function(req, res) {
        return router(address.client.new_query, req, res);
    });

    app.get('/create/project', authorize, function(req, res) {
        return router(address.client.new_project, req, res);
    });

    app.get('/logout', function(req, res) {
        res.clearCookie('_auth');
        router(address.client.logout, req, res);
    });
};
