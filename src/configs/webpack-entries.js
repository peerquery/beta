
var paths = require('./paths.js');

var entry = {};

entry = {
	ui: paths.ui,
	login: paths.login,
    index_p: paths.index_p,
	projects_p: paths.projects_p,
	queries: paths.queries,
	project_page: paths.project_p,
	project_home: paths.project_home,
	project_reports: paths.project_reports,
	project_members: paths.project_members,
	project_settings: paths.project_settings,
	reports_p: paths.reports_p,
	peers_p: paths.peers_p,
	peer_p: paths.peer_p,
	steem_p: paths.steem_p,
	report: paths.report,
	create_report: paths.create_report,
	create_query: paths.create_query,
	create_project: paths.create_project,
	project_queries: paths.project_queries,
}
    
module.exports = entry;
