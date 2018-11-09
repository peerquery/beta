'use strict';

var router = require('../../server/router'),
    address = require('../indexes/address'),
    authorize = require('../auth/authorize'),
    settings = require('../../models/settings'),
    team = require('../../models/team');

module.exports = function(app) {
    app.get('/office', authorize, async function(req, res) {
        var query = 'account role -_id';
        //the below clause makes sure only the team can access this route
        var results = await team
            .findOne({ account: req.active_user.account })
            .select(query);

        if (!results || results == '')
            return router(address._static._403, req, res);

        res.req_data = results;
        return router(address.office.office, req, res);
    });

    app.get('/office/dashboard', authorize, async function(req, res) {
        var query = 'account role -_id';
        //the below clause makes sure only the team can access this route
        var results = await team
            .findOne({ account: req.active_user.account })
            .select(query);

        if (!results || results == '')
            return router(address._static._403, req, res);

        return router(address.office.dashboard, req, res);
    });

    app.get('/office/curation', authorize, async function(req, res) {
        var query = 'account role -_id';
        //the below clause makes sure only the team can access this route
        var results = await team
            .findOne({ account: req.active_user.account })
            .select(query);

        if (!results || results == '')
            return router(address._static._403, req, res);

        return router(address.office.curation, req, res);
    });

    /*
    app.get('/office/write', authorize, async function(req, res) {
            var query = 'account role -_id';
            //the below clause makes sure only the owner/admin can access this route
            var results = await team
                .findOne({ account: req.active_user.account })
                .select(query);

            if (!results || results == '')
                return router(address._static._403, req, res);

        return router(address.office.write, req, res);
    });
    */

    app.get('/office/manage', authorize, async function(req, res) {
        var query = 'account role -_id';
        //the below clause makes sure only the owner/admin can access this route
        var results = await team
            .findOne({
                account: req.active_user.account,
                role: { $in: ['admin', 'admin'] },
            })
            .select(query);

        if (!results || results == '')
            return router(address._static._403, req, res);

        return router(address.office.manage, req, res);
    });

    app.get('/office/settings', authorize, async function(req, res) {
        var query = 'account role -_id';
        //the below clause makes sure only the owner/admin can access this route
        var results = await team
            .findOne({
                account: req.active_user.account,
                role: { $in: ['admin', 'admin'] },
            })
            .select(query);

        if (!results || results == '')
            return router(address._static._403, req, res);

        return router(address.office.settings, req, res);
    });
};
