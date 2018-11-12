'use strict';

var client = require('../routes/client'),
    content = require('../routes/content'),
    office = require('../routes/office');

module.exports = async function(app) {
    client(app);
    office(app);
    content(app); //always mount this router last, else **/@:username/:permLink** will override some of the routes handled above
};
