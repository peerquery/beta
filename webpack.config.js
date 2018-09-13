// webpack.config.js
var path = require('path'),
	nodeExternals = require('webpack-node-externals'),
	paths =  require('./src/configs/paths'),
	webpack = require('webpack');

module.exports = {
	entry: {
		
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
	},
	//target: 'node',
	output: {
		path: path.join(__dirname, 'public', 'build', 'dist'),
		filename: '[name].js'
	},
    plugins: [
        new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		})
	],
	module: {
		rules: [
			{
			test: /\.css$/,
				use: [
					{ loader: "style-loader" },
					{ loader: "css-loader" }
				]
			},
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				loader: 'url-loader?limit=100000'
			},
			//{			//requires a dependency, not devDepency: babel-polyfill
              //  test: /\.js$/,
                //loader: 'babel-loader',
                //query: {
                //    "presets": ["env"]
                //}
            //}
		]
	},
	stats: {
        colors: true
    },
    //devtool: 'source-map',
	mode: 'production'
	//mode: 'development'
}
