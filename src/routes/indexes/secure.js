'use strict';

var client = require('../routes/client'),
    content = require('../routes/content'),
    account = require('../routes/account'),
    office = require('../routes/office');

module.exports = async function(app) {
    client(app);
    office(app);
    account(app);
    content(app); //always mount this router last, else **/@:username/:permLink** will override some of the routes handled above
};
