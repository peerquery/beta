// webpack.config.js
var path = require('path'),
	webpack_entry = require('./src/configs/webpack-entries'),
	paths =  require('./src/configs/paths'),
    extractTextPlugin = require("extract-text-webpack-plugin"),
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
		}),
        new extractTextPlugin("styles.css"),
	],
	module: {
		rules: [
			{
			test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
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
	stats: {
        colors: true
    },
    //devtool: 'source-map',
	mode: 'production'
	//mode: 'development'
}
