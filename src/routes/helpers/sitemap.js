'use strict';

var fs = require('fs'),
    util = require('util'),
    sm = require('sitemap'),
    peerSchema = require('../../models/peer'),
    reportSchema = require('../../models/report'),
    querySchema = require('../../models/query'),
    projectSchema = require('../../models/project'),
    config = require('../../configs/config'),
    read = util.promisify(fs.readFile);

module.exports = function(app) {
    var reportSitemap = sm.createSitemap({
        hostname: config.site_uri,
        cacheTime: 1000 * 60 * 24, //keep the sitemap cached for 24 hours
    });

    var peerSitemap = sm.createSitemap({
        hostname: config.site_uri,
        cacheTime: 1000 * 60 * 24, //keep the sitemap cached for 24 hours
    });

    var projectSitemap = sm.createSitemap({
        hostname: config.site_uri,
        cacheTime: 1000 * 60 * 24, //keep the sitemap cached for 24 hours
    });

    var querySitemap = sm.createSitemap({
        hostname: config.site_uri,
        cacheTime: 1000 * 60 * 24, //keep the sitemap cached for 24 hours
    });

    var siteSitemap = sm.createSitemap({
        hostname: config.site_uri,
        cacheTime: 1000 * 60 * 24 * 7, //keep the sitemap cached for 7 days hours
        urls: [
            { url: '/', changefreq: 'daily', priority: 1 },
            { url: '/projects', changefreq: 'daily', priority: 0.7 },
            { url: '/queries', changefreq: 'daily', priority: 0.7 },
            { url: '/reports', changefreq: 'daily', priority: 0.7 },
            { url: '/peers', changefreq: 'daily', priority: 0.7 },
            { url: '/create', changefreq: 'monthly', priority: 0.7 },
            { url: '/login', changefreq: 'monthly', priority: 0.3 },
            { url: '/support/faqs', changefreq: 'monthly', priority: 0.5 },
            { url: '/support/contact', changefreq: 'monthly', priority: 0.3 },
            { url: '/abuse', changefreq: 'monthly', priority: 0.3 },
            { url: '/full-disclosure', changefreq: 'monthly', priority: 0.3 },
            {
                url: '/terms-and-conditions',
                changefreq: 'monthly',
                priority: 0.3,
            },
            { url: '/privacy-policy', changefreq: 'monthly', priority: 0.3 },
        ],
    });

    async function addReportsToSitemap(data) {
        try {
            //console.log(data);
            for (var x in data) {
                reportSitemap.add({
                    url: config.site_uri + '/report/' + data[x].permlink,
                    changefreq: 'daily',
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function addPeersToSitemap(data) {
        try {
            //console.log(data);
            for (var x in data) {
                peerSitemap.add({
                    url: config.site_uri + '/peer/' + data[x].account,
                    changefreq: 'daily',
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function addProjectsToSitemap(data) {
        try {
            //console.log(data);
            for (var x in data) {
                projectSitemap.add({
                    url: config.site_uri + '/project/' + data[x].slug,
                    changefreq: 'daily',
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function addQueriesToSitemap(data) {
        try {
            //console.log(data);
            for (var x in data) {
                querySitemap.add({
                    url: config.site_uri + '/query/' + data[x].permlink,
                    changefreq: 'daily',
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    //init
    (async () => {
        try {
            var reports = await reportSchema
                .find({}, 'permlink')
                .sort({ _id: 1 })
                .limit(100);
            var queries = await querySchema
                .find({}, 'permlink')
                .sort({ _id: 1 })
                .limit(100);
            var projects = await projectSchema
                .find({}, 'slug')
                .sort({ _id: 1 })
                .limit(100);
            var peers = await peerSchema
                .find({}, 'account')
                .sort({ _id: 1 })
                .limit(100);

            addReportsToSitemap(reports);
            addQueriesToSitemap(queries);
            addProjectsToSitemap(projects);
            addPeersToSitemap(peers);
        } catch (err) {
            console.log(err);
        }
    })();

    app.get('/sitemap.xml', (req, res) => {
        res.redirect('/sitemap_index.xml');
    });

    app.get('/sitemap_index.xml', async (req, res) => {
        var peer = await peerSchema.findOne({}, '_id created').sort({ _id: 1 });
        var report = await reportSchema
            .findOne({}, '_id created')
            .sort({ _id: 1 });
        var query = await querySchema
            .findOne({}, '_id created')
            .sort({ _id: 1 });
        var project = await projectSchema
            .findOne({}, '_id created')
            .sort({ _id: 1 });

        var sm_i = await read('./src/configs/sitemap_index.xml', 'utf8'); //this whole part is exported to main app so path are related not to here

        sm_i = sm_i.replace(/SITE_URI/g, config.site_uri);
        sm_i = sm_i.replace(/LAST_UPDATED_SITE/g, new Date());
        sm_i = sm_i.replace(/LAST_UPDATED_PEERS/g, peer.created || new Date());
        sm_i = sm_i.replace(
            /LAST_UPDATED_PROJECTS/g,
            project.created || new Date()
        );
        sm_i = sm_i.replace(
            /LAST_UPDATED_REPORTS/g,
            report.created || new Date()
        );
        sm_i = sm_i.replace(
            /LAST_UPDATED_QUERIES/g,
            query.created || new Date()
        );

        res.set('Content-Type', 'application/xml');
        res.end(sm_i);

        //res.sendFile( 'sitemap_index.xml', { root: './config/' } );
    });

    app.get('/report-sitemap.xml', async (req, res) => {
        //console.log(reportSitemap.toString

        try {
            if (reportSitemap.isCacheValid()) {
                let xml = await reportSitemap.toXML();
                res.header('Content-Type', 'application/xml');
                res.send(xml);
            } else {
                //remove every page from the expired sitemap
                reportSitemap.urls = [];

                //get every post from the database
                //if some error occurs, generate an empty sitemap instead of aborting

                var reports = await reportSchema
                    .find({}, 'permlink category')
                    .sort({ _id: 1 })
                    .limit(100);
                await addReportsToSitemap(reports);

                let xml = await reportSitemap.toXML();
                res.header('Content-Type', 'application/xml');
                res.send(xml);
            }
        } catch (err) {
            console.log(err);
            res.status(500).redirect('/sitemap.xml');
        }
    });

    app.get('/peer-sitemap.xml', async (req, res) => {
        //console.log(peerSitemap.toString

        try {
            if (peerSitemap.isCacheValid()) {
                let xml = await peerSitemap.toXML();
                res.header('Content-Type', 'application/xml');
                res.send(xml);
            } else {
                //remove every page from the expired sitemap
                peerSitemap.urls = [];

                //get every post from the database
                //if some error occurs, generate an empty sitemap instead of aborting

                var peers = await peerSchema
                    .find({}, 'account')
                    .sort({ _id: 1 })
                    .limit(100);
                await addPeersToSitemap(peers);

                let xml = await peerSitemap.toXML();
                res.header('Content-Type', 'application/xml');
                res.send(xml);
            }
        } catch (err) {
            console.log(err);
            res.status(500).redirect('/sitemap.xml');
        }
    });

    app.get('/project-sitemap.xml', async (req, res) => {
        //console.log(projectSitemap.toString

        try {
            if (projectSitemap.isCacheValid()) {
                let xml = await projectSitemap.toXML();
                res.header('Content-Type', 'application/xml');
                res.send(xml);
            } else {
                //remove every page from the expired sitemap
                projectSitemap.urls = [];

                //get every post from the database
                //if some error occurs, generate an empty sitemap instead of aborting

                var projects = await projectSchema
                    .find({}, 'slug')
                    .sort({ _id: 1 })
                    .limit(100);
                await addProjectsToSitemap(projects);

                let xml = await projectSitemap.toXML();
                res.header('Content-Type', 'application/xml');
                res.send(xml);
            }
        } catch (err) {
            console.log(err);
            res.status(500).redirect('/sitemap.xml');
        }
    });

    app.get('/query-sitemap.xml', async (req, res) => {
        //console.log(querySitemap.toString

        try {
            if (querySitemap.isCacheValid()) {
                let xml = await querySitemap.toXML();
                res.header('Content-Type', 'application/xml');
                res.send(xml);
            } else {
                //remove every page from the expired sitemap
                querySitemap.urls = [];

                //get every post from the database
                //if some error occurs, generate an empty sitemap instead of aborting

                var queries = await querySchema
                    .find({}, 'permlink')
                    .sort({ _id: 1 })
                    .limit(100);
                await addQueriesToSitemap(queries);

                let xml = await querySitemap.toXML();
                res.header('Content-Type', 'application/xml');
                res.send(xml);
            }
        } catch (err) {
            console.log(err);
            res.status(500).redirect('/sitemap.xml');
        }
    });

    app.get('/site-sitemap.xml', (req, res) => {
        //console.log(siteSitemap.toString());

        try {
            let xml = siteSitemap.toXML();
            res.header('Content-Type', 'application/xml');
            res.send(xml);
        } catch (err) {
            console.log(err);
            res.status(500).redirect('/sitemap.xml');
        }
    });
};
