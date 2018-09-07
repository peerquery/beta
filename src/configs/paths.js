const fs = require('fs');
const path = require('path');

const root = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(root, relativePath);
const resolveRuntime = relativePath => path.resolve(fs.realpathSync(process.cwd()), relativePath);

module.exports = {
	dir: resolveApp('.'),
	app: resolveApp('./src/app.js'),
	ui: resolveApp('./src/client/ui.js'),
	db_setup: resolveApp('./sql/db-manager.js'),
	login: resolveApp('./src/client/pages/login.js'),
	config: resolveApp('./configs/config.js'),
	index_p: resolveApp('./src/client/pages/index.js'),
	projects_p: resolveApp('./src/client/pages/projects.js'),
	project_p: resolveApp('./src/client/pages/project.js'),
	reports_p: resolveApp('./src/client/pages/reports.js'),
	project_home: resolveApp('./src/client/pages/partials/project-home.js'),
	project_reports: resolveApp('./src/client/pages/partials/project-reports.js'),
	project_members: resolveApp('./src/client/pages/partials/project-members.js'),
	project_settings: resolveApp('./src/client/pages/partials/project-settings.js'),
	peers_p: resolveApp('./src/client/pages/peers.js'),
	peer_p: resolveApp('./src/client/pages/peer.js'),
	steem_p: resolveApp('./src/client/pages/steem.js'),
	report_view: resolveApp('./src/client/pages/report-view.js'),
	create_project: resolveApp('./src/client/pages/create-project.js'),
	create_report: resolveApp('./src/client/pages/create-report.js'),
	cors: resolveApp('./configs/cors.js'),
	public: resolveApp('./public'),
	server: resolveApp('./src/server/server.js'),
	client: resolveApp('./src/client/index.js'),
	publicRuntime: () => resolveRuntime('./public')
};