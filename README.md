[![Pull requests](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](https://github.com/peerquery/beta/pulls)
[![Build status](https://travis-ci.org/peerquery/beta.svg?branch=master)](https://travis-ci.org/peerquery/beta)
[![Dep tracker](https://david-dm.org/peerquery/beta.svg)](https://david-dm.org/peerquery/beta)
[![Codebase license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/peerquery/beta/blob/master/LICENSE)
[![Chat](https://img.shields.io/badge/Chat-Discord-ff69b4.svg)](https://discord.gg/rz9GwAa)

# Peer Query BETA

[Peer Query](https://www.peerquery.com) is a peer-to-peer collaboration platform powered by the [Steem Blockchain](https://steem.io).

# Tech stack

-   Node.js, Express.js & EJS
-   MongoDb & Mongoose.js
-   Semantic UI & JQuery frontend
-   Steem & DSteem
-   Webpack
-   See `package.json` for full dependencies list

# How to start the server

-   Create your dev folder
-   Git clone this repo into it: `git@github.com:peerquery/beta.git` or `https://github.com/peerquery/beta.git`
-   Setup `.env` file using the `sample.env` as guide. Customize `/src/configs/config.js`
-   `npm install` to install dependencies
-   `npm run build` in the command prompt(while in the root dev folder) to build assets
-   `npm start` in the command prompt(while in the root dev folder)
-   Visit `http://lvh.me` or `http://localhost` to see Peer Query running

# Warning

This repo and its content are still in active development and will see lots of breaking updates.
