'use strict';

const project_template = require('./templates/project'),
    user_template = require('./templates/peer'),
    report_view_template = require('./templates/report'),
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

        div.innerHTML = mtools.build.template(report_view_template, data);

        return div;
    },
};
