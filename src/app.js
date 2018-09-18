
'use strict';
	
const init = async () => {
	
	require('dotenv').config();
	
	const mongoose = require('./configs/mongoose'),
		path = require('path'),
		favicon = require('serve-favicon'),
		express = require('./server/server');
		//start = require('./server/init')();
    
	try {
		var db = mongoose();
			var server = express();
	} catch(err){
		console.log(err);
	}	
	
	server.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));
    
    const node_env = process.env.NODE_ENV,
        server_port = Number(process.env.SERVER_PORT) || 80,
        port = (node_env == 'production') ? server_port + 8001 : server_port;
        
	server.listen(port);
	//start();
	
	console.log('\n\n\nServer running at port: ' + port);
	
}

init();

module.exports = init;