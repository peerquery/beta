const fs = require('fs'),
    path = require('path'),
    root = fs.realpathSync(process.cwd()),
    resolveApp = relativePath => path.resolve(root, relativePath),
    resolveRuntime = relativePath =>
        path.resolve(fs.realpathSync(process.cwd()), relativePath);

module.exports = {
    dir: resolveApp('.'),
    app: resolveApp('./src/app.js'),
    //styles: [ resolveApp('./node_modules/semantic-ui-css/semantic.min.css'), resolveApp('./src/configs/global.css') ],
    styles: resolveApp('./src/client/ui/styles.js'),
    scripts: resolveApp('./src/client/ui/scripts_index.js'),
    login: resolveApp('./src/client/pages/login.js'),
    logout: resolveApp('./src/client/pages/logout.js'),
    config: resolveApp('./configs/config.js'),
    index: resolveApp('./src/client/pages/index.js'),
    projects: resolveApp('./src/client/pages/projects.js'),
    project: resolveApp('./src/client/pages/project.js'),
    reports: resolveApp('./src/client/pages/reports.js'),
    project_home: resolveApp('./src/client/pages/partials/project-home.js'),
    project_reports: resolveApp(
        './src/client/pages/partials/project-reports.js'
    ),
    project_queries: resolveApp(
        './src/client/pages/partials/project-queries.js'
    ),
    project_members: resolveApp(
        './src/client/pages/partials/project-members.js'
    ),
    project_requests: resolveApp(
        './src/client/pages/partials/project-requests.js'
    ),
    project_manage: resolveApp('./src/client/pages/partials/project-manage.js'),
    project_stats: resolveApp('./src/client/pages/partials/project-stats.js'),
    project_messages: resolveApp(
        './src/client/pages/partials/project-messages.js'
    ),
    project_edit: resolveApp('./src/client/pages/partials/project-edit.js'),
    project_settings: resolveApp(
        './src/client/pages/partials/project-settings.js'
    ),
    //office
    office_dashboard: resolveApp('./src/client/pages/office-dashboard.js'),
    office_curation: resolveApp('./src/client/pages/office-curation.js'),
    office_team: resolveApp('./src/client/pages/office-team.js'),
    office_settings: resolveApp('./src/client/pages/office-settings.js'),
    //static
    statistics: resolveApp('./src/client/pages/statistics.js'),
    //peer
    peer_projects: resolveApp('./src/client/pages/peer-projects.js'),
    peer_reports: resolveApp('./src/client/pages/peer-reports.js'),
    peer_queries: resolveApp('./src/client/pages/peer-queries.js'),
    //
    search: resolveApp('./src/client/pages/search.js'),
    blog: resolveApp('./src/client/pages/blog.js'),
    curation: resolveApp('./src/client/pages/curation.js'),
    peers: resolveApp('./src/client/pages/peers.js'),
    wallet: resolveApp('./src/client/pages/wallet.js'),
    peer: resolveApp('./src/client/pages/peer.js'),
    steem: resolveApp('./src/client/pages/steem.js'),
    query: resolveApp('./src/client/pages/query.js'),
    report: resolveApp('./src/client/pages/report.js'),
    queries: resolveApp('./src/client/pages/queries.js'),
    create_report: resolveApp('./src/client/pages/create-report.js'),
    create_query: resolveApp('./src/client/pages/create-query.js'),
    create_project: resolveApp('./src/client/pages/create-project.js'),
    public: resolveApp('./public'),
    server: resolveApp('./src/server/server.js'),
    client: resolveApp('./src/client/index.js'),
    publicRuntime: () => resolveRuntime('./public'),
};
