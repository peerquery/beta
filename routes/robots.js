

module.exports = function(app) {

app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send(
		"User-agent: *" +
		"\nDisallow: /office*/" +
		"\nDisallow: /api*/" +
		"\nSitemap: https://www.peerquery.com/sitemap.xml"
	);
});

}
