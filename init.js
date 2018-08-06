
'use strict';
	
(async function init() {
	try {
		console.log('  * starting main server\n');
		
		require('./src/server')();
		
	} catch (err) {
		console.log(err);
	}
})()


process.on('unhandledRejection', (reason, promise) => {
	console.log('\n\n\nUnhandled Rejection at:', reason.stack || reason);
	// log crash report if you want
	
	//uncomment below only in 'production'!?
	//console.log('  ** re-initializing the server\n\n\n');
	//init();
})
