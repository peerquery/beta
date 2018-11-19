'use strict';

var auth = require('./auth/index'),
    content = require('./content/index'),
    create = require('./create/index'),
    manage = require('./manage/index'),
    _static = require('./static/index'),
    office = require('./office/index');

module.exports = function(app) {
    auth(app);
    content(app);
    create(app);
    manage(app);
    _static(app);
    office(app);
};
