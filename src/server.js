
'use strict'

	var express = require('express'),
		path = require('path'),
		favicon = require('serve-favicon'),
		fs = require('fs'),
		rfs = require('rotating-file-stream'),
		bodyParser = require('body-parser'),
		cookieParser = require('cookie-parser'),
		routes = require('../routes/_index');
		
module.exports = function() {
	
	require('atob');
	require('btoa');
	
	require('dotenv').config();

	var app = express();
	//app.use(favicon(path.join(__dirname, '../public/assets/img', 'favicon.ico')));
	app.use(cookieParser());
	
	
	
	// Additional middleware which will set headers that we need on each request.
	app.use(function(req, res, next) {
		// Set permissive CORS header - this allows this server to be used only as
		// an API server in conjunction with something like webpack-dev-server.
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
		res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
	
		// Disable caching so we'll always get the latest comments.
		res.setHeader('Cache-Control', 'no-cache');
		next();
	});

	
    

	// view engine setup
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'ejs');

	
	// defaults
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(express.static(path.join(__dirname, '../public')));
	//app.use(favicon(__dirname + '/public/assets/img/favicon.ico'));
	
	
	
	// setup routes
	routes(app);
	
	
	//custom server error handler function
	app.use(function(err, req, res, next) {
		console.log('process err (500) : \n' + err);
		res.status(500).send("Sorry, something broken on our side. We're fixing it!");
	});

	//custom file not found error handler function
	app.use(function(req, res, next) {
		console.log('files not found (404) err: ' + req.url);
		//res.status(404).send("custom not found handler called");
		res.render('static/404.ejs');
	});
	
	
	var port = process.env.PORT || 8080;
	app.listen(port, (err) => {
		if (err) {
			return console.log('something bad happened', err)
		}
		console.log(`server is listening on ${port}`)
	});


	
	return app;

};
