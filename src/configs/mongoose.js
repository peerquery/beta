
'use strict';

var	mongoose = require('mongoose');

module.exports = function() {
	
    mongoose.Promise = global.Promise;
    var db = mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, autoIndex: false });
	
    return db;
};
