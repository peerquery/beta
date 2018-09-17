// webpack.config.js
var path = require('path'),
	webpack_entry = require('./src/configs/webpack-entries'),
	nodeExternals = require('webpack-node-externals'),
	paths =  require('./src/configs/paths'),
	webpack = require('webpack');

module.exports = {
	entry: webpack_entry,
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
			/*
            {	//requires a dependency, not devDepency: babel-polyfill
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['env'],
                    //"presets": ["env"]
                }
            }
            */
		]
	},
    externals: [nodeExternals()],
	stats: {
        colors: true
    },
    //devtool: 'source-map',
	mode: 'production'
	//mode: 'development'
}
