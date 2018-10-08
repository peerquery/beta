// webpack.config.js
const path = require('path');
const webpack_entry = require('./src/configs/webpack-entries');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const env = require('dotenv').config();

module.exports = {
    entry: webpack_entry,
    output: {
        path: path.join(__dirname, 'public', 'build', 'dist'),
        filename: '[name].js',
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new miniCssExtractPlugin({ filename: '[name].css' }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    miniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()],
    },
    stats: {
        colors: true,
        entrypoints: false,
        children: false,
    },
    devtool: process.env.NODE_ENV == 'debugging' ? 'source-map' : false,
    mode:
        process.env.NODE_ENV == 'production' ||
        process.env.NODE_ENV == 'staging'
            ? 'production'
            : 'development',
    //travis ci uses NODE_ENV='staging', if set to 'production' it will not install devDependencies - which are required for building including 'webpack'
};
