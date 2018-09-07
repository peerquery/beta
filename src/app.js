
'use strict';
	
const init = async () => {
	
	require('dotenv').config();
	
	const mongoose = require('./configs/mongoose'),
		path = require('path'),
		favicon = require('serve-favicon'),
		express = require('./server/server');
		//start = require('./server/init')();
    
	try {
		var db = mongoose(),
			server = express();
	} catch(err){
		console.log(err);
	}	
	
	server.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));
	server.listen(8081);
	//start();
	
	console.log('\n\n\nServer running at port: 8081');
	
}

init();

process.on('unhandledRejection', (reason, promise) => {
	console.log('\n\n\nUnhandled Rejection at:', reason.stack || reason);
	// log crash report if you want
	
	//uncomment below only in 'production'!?
	//console.log('  ** re-initializing the server\n\n\n');
	//init();
})
