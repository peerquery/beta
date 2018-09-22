
'use strict';

//well, we have our own simple native template engines
//its smaller, lighter, faster and easier than bundling .ejs to the frontend
		
var templater = function(html){
    return function(data){
        for (var x in data){
            var re = '{{\\s?' + x + '\\s?}}';
            html = html.replace(new RegExp(re, 'ig'), data[x]);
        }
        return html;
    };
};

module.exports = templater;