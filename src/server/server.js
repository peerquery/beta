
'use strict';

var express = require('express'),
	helmet = require('helmet'),
	bodyParser = require('body-parser'),
    mongoSanitize = require('express-mongo-sanitize'),
	cookie = require('cookie-parser'),
	csrf = require('csurf'),
	hpp = require('hpp'),
	cache = require('./cache'),
	csrf_config = require('./csrf'),
	limiter = require('./limiter'),
	compression = require('compression'),
	cors = require('./cors'),
	vet = require('../routes/auth/vet'),
	api_authorize = require('../apis/authorize'),
	common_routes = require('../routes/indexes/common'),
	secure_routes = require('../routes/indexes/secure'),
	_500_route = require('../routes/routes/500'),
	_404_route = require('../routes/routes/404'),
	common_apis = require('../apis/common'),
	secure_apis = require('../apis/secure');
	
module.exports = function(app) {
	
	var app = express();
	app.use(helmet());
	
	app.enable('trust proxy'); // since we are behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
	
	app.set('views', __dirname + '/../views');
	app.set('view engine', 'ejs');
	
	app.use(cors);
	app.use(compression());
	app.use(cookie(process.env.COOKIE_SECRET));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(hpp());
	
	app.use(limiter);
	//app.use(cache);
	app.use(express.static(__dirname + '/../../public'));     //could comment out for the sake of Elastic BeanStalk proxy server for serving static files
	
	//sanitize user inputs against possibly dangerous DB expressions among user inputs
	app.use(mongoSanitize());
    
	app.use(vet);
	
	//make sure only logged-in user can access the private apis
	app.use('/api/private/', api_authorize);
	
	//now implement csrf protection for secured view routes and api routes
	app.use(csrf({ cookie: true }));
	app.use(csrf_config);
	
	//declared before csrf module since these routes do not need protection
	common_routes(app);
	common_apis(app);
	
	secure_routes(app);
	secure_apis(app);
	
	app.use(_500_route);
	app.use(_404_route);
	
	return app;
	
}
