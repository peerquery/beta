
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var settingsSchema = new Schema({
	
    admin_account: { type: String, unique: true, required: true },
    admin_email: { type: String, unique: true, required: true },
    admin_hash: { type: String, required: true },
    init_time: { type: Date, Default: Date.now, required: true },
    updated_at: Date
	
},{
    //has to be a single document
    collection:'settingsSchema',
    capped: { size: 1024, max: 1}
	
});

module.exports = mongoose.model('settingsSchema', settingsSchema);
