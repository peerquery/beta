var paths = require('./paths.js');

var entry = {};

entry = {
    styles: paths.styles,
    scripts: paths.scripts,
    login: paths.login,
    logout: paths.logout,
    index: paths.index,
    projects: paths.projects,
    queries: paths.queries,
    project: paths.project,
    project_home: paths.project_home,
    project_reports: paths.project_reports,
    project_members: paths.project_members,
    project_messages: paths.project_messages,
    project_manage: paths.project_manage,
    project_requests: paths.project_requests,
    project_stats: paths.project_stats,
    project_edit: paths.project_edit,
    project_settings: paths.project_settings,
    project_queries: paths.project_queries,
    reports: paths.reports,
    query: paths.query,
    peers: paths.peers,
    peer: paths.peer,
    steem: paths.steem,
    wallet: paths.wallet,
    report: paths.report,
    create_report: paths.create_report,
    create_query: paths.create_query,
    create_project: paths.create_project,
};

module.exports = entry;
