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
    project_settings: resolveApp(
        './src/client/pages/partials/project-settings.js'
    ),
    peers: resolveApp('./src/client/pages/peers.js'),
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
