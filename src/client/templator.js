'use strict';

const project_template = require('./templates/project'),
    user_template = require('./templates/peer'),
    report_template = require('./templates/report'),
    search_template = require('./templates/search'),
    message_template = require('./templates/message'),
    mtools = require('markup-tools');

module.exports = {
    project: async function(data) {
        var div = document.createElement('div');
        div.className = 'ui card';

        div.innerHTML = mtools.build.template(project_template, data);

        return div;
    },

    peer: async function(data) {
        var div = document.createElement('div');
        div.className = 'ui card';

        div.innerHTML = mtools.build.template(user_template, data);

        return div;
    },

    report: async function(data) {
        var div = document.createElement('div');
        div.className = '';

        div.innerHTML = mtools.build.template(report_template, data);

        return div;
    },

    search: async function(data) {
        var div = document.createElement('div');
        div.className = 'event';

        div.innerHTML = mtools.build.template(search_template, data);

        return div;
    },

    message: async function(data) {
        var div = document.createElement('div');
        div.className = 'item';

        div.innerHTML = mtools.build.template(message_template, data);

        return div;
    },
};
