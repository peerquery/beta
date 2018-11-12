'use strict';

var auth = require('./auth/index'),
    content = require('./content/index'),
    create = require('./create/index'),
    manage = require('./manage/index'),
    office = require('./office/index');

module.exports = function(app) {
    auth(app);
    content(app);
    create(app);
    manage(app);
    office(app);
};
