'use strict';

var auth = require('./auth/index'),
    content = require('./content/index'),
    create = require('./create/index'),
    account = require('./account/index'),
    manage = require('./manage/index'),
    _static = require('./static/index'),
    office = require('./office/index');

module.exports = function(app) {
    auth(app);
    account(app);
    content(app);
    create(app);
    manage(app);
    _static(app);
    office(app);
};
