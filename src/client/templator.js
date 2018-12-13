'use strict';

const project_template = require('./templates/project'),
    user_template = require('./templates/peer'),
    report_template = require('./templates/report'),
    search_template = require('./templates/search'),
    message_template = require('./templates/message'),
    activity_template = require('./templates/activity'),
    notification_template = require('./templates/notification'),
    community_template = require('./templates/community'),
    membership_template = require('./templates/membership'),
    hire_template = require('./templates/hire'),
    sidebar_query_template = require('./templates/sidebar_query'),
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

    activity: async function(data) {
        var div = document.createElement('div');
        div.className = 'event';

        div.innerHTML = mtools.build.template(activity_template, data);

        return div;
    },

    notification: async function(data) {
        var div = document.createElement('div');
        div.className = 'event';

        div.innerHTML = mtools.build.template(notification_template, data);

        return div;
    },

    membership: async function(data) {
        var div = document.createElement('div');
        div.className = 'ui card';

        div.innerHTML = mtools.build.template(membership_template, data);

        return div;
    },

    community: async function(data) {
        var div = document.createElement('div');
        div.className = 'ui card';

        div.innerHTML = mtools.build.template(community_template, data);

        return div;
    },

    hire: async function(data) {
        var div = document.createElement('div');
        div.className = 'item';

        div.innerHTML = mtools.build.template(hire_template, data);

        return div;
    },

    sidebar_query: async function(data) {
        var div = document.createElement('div');
        div.className = 'event';

        div.innerHTML = mtools.build.template(sidebar_query_template, data);

        return div;
    },
};
