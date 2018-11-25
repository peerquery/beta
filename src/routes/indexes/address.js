var address = {};

//content views
address.content = {};
address.content.index = 'content/index';
address.content.steem = 'content/steem';
address.content.peers = 'content/peers';
address.content.peer = 'content/peer';
address.content.projects = 'content/projects';
address.content.project = 'content/project';
address.content.queries = 'content/queries';
address.content.query = 'content/query';
address.content.reports = 'content/reports';
address.content.report = 'content/report';
address.content.wallet = 'content/wallet';
address.content.search = 'content/search';

address.content.peer_projects = 'content/peer-projects';
address.content.peer_reports = 'content/peer-reports';
address.content.peer_queries = 'content/peer-queries';

//client views
address.client = {};
address.client.login = 'client/login';
address.client.logout = 'client/logout';
address.client.new_report = 'client/new-report';
address.client.new_query = 'client/new-query';
address.client.new_project = 'client/new-project';

//office views
address.office = {};
address.office.office = 'office/office';
address.office.dashboard = 'office/dashboard';
address.office.curation = 'office/curation';
address.office.team = 'office/team';
address.office.settings = 'office/settings';

//static views
address._static = {};
address._static.create = 'static/create';
address._static.curation = 'static/curation';
address._static.support = 'static/support';
address._static.blog = 'static/blog';
address._static.partners = 'static/partners';
address._static.statistics = 'static/statistics';
address._static.opensource = 'static/open-source';
address._static._403 = 'static/403';
address._static._404 = 'static/404';
address._static._500 = 'static/500';
address._static.about = 'static/about';
address._static.contact = 'static/contact';
address._static.faqs = 'static/faqs';
address._static.team = 'static/team';
address._static.abuse = 'static/abuse';
address._static.privacy = 'static/privacy-policy';
address._static.disclosure = 'static/full-disclosure';
address._static.terms = 'static/terms-and-conditions';

module.exports = address;
