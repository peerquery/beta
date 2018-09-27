'use strict';

var client = require('../routes/client'),
    content = require('../routes/content');

module.exports = async function(app) {
    client(app);
    content(app); //always mount this router last, else **/@:username/:permLink** will override some of the routes handled above
};
