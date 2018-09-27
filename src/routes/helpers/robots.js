module.exports = function(app) {
    app.get('/robots.txt', function(req, res) {
        var data;
        if (req.subdomains.indexOf('staging') > -1) {
            //staging deployment
            data = 'User-agent: *' + '\nDisallow: /';
        } else {
            //production deployment
            data =
                'User-agent: *' +
                '\nDisallow: /api*' +
                '\nSitemap: https://www.peerquery.com/sitemap.xml';
        }
        res.type('text/plain');
        res.send(data);
    });
};
