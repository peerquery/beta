'use strict';

var stats = require('../../models/stats'),
    router = require('../../server/router'),
    address = require('../indexes/address');

module.exports = function(app) {
    app.get('/about', async function(req, res) {
        try {
            var query =
                'peer_count project_count curation_worth request_count -_id';

            var results = await stats
                .findOne({ identifier: 'default' })
                .select(query);

            if (!results || results == '')
                return router(address._static._404, req, res);

            res.req_data = results;
            return router(address._static.about, req, res);
        } catch (err) {
            console.log(err);
            return router(address._static._500, req, res);
        }

        //return router(address._static.about, req, res);
    });

    app.get('/create', function(req, res) {
        return router(address._static.create, req, res);
    });

    app.get('/curation', function(req, res) {
        return router(address._static.curation, req, res);
    });

    app.get('/statistics', function(req, res) {
        return router(address._static.statistics, req, res);
    });

    app.get('/abuse', function(req, res) {
        return router(address._static.abuse, req, res);
    });

    app.get('/partners', function(req, res) {
        return router(address._static.partners, req, res);
    });

    app.get('/blog', function(req, res) {
        return router(address._static.blog, req, res);
    });

    app.get('/support', function(req, res) {
        return router(address._static.support, req, res);
    });

    app.get('/support/contact', function(req, res) {
        return router(address._static.contact, req, res);
    });

    app.get('/support/faqs', function(req, res) {
        return router(address._static.faqs, req, res);
    });

    app.get('/open-source', function(req, res) {
        return router(address._static.opensource, req, res);
    });

    app.get('/team', function(req, res) {
        return router(address._static.team, req, res);
    });

    app.get('/privacy-policy', function(req, res) {
        return router(address._static.privacy, req, res);
    });

    app.get('/full-disclosure', function(req, res) {
        return router(address._static.disclosure, req, res);
    });

    app.get('/terms-and-conditions', function(req, res) {
        return router(address._static.terms, req, res);
    });
    /*
	app.get('/HNAP1/', function (req, res) {
		//console.log(req);
		//res.status(408).json({try: 'harder'});
	})
	*/
};
