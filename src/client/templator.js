
'use strict';

const project_template = require('./templates/project'),
	user_template = require('./templates/peer'),
	report_view_template = require('./templates/report_view'),
	templater = require('./template-engine');

module.exports = {
	
	project: async function(data) {
		
		var template = await templater(project_template);
		
		var div = document.createElement("div");
		div.className = "ui card";
	
		div.innerHTML = await template( data );
		
		return div;
	},
	
	peer: async function(data) {
		
		var template = await templater(user_template);
		
		var div = document.createElement("div");
		div.className = "ui card";
	
		div.innerHTML = await template( data );
		
		return div;
	},
	
	report_view: async function(data) {
		
		var template = await templater(report_view_template);
		
		var div = document.createElement("div");
		div.className = "";
	
		div.innerHTML = await template( data );
		
		return div;
	},
	
}
