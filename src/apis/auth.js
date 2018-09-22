
'use strict';

var jwt = require('jsonwebtoken'),
    encryptor = require('../lib/encryptor'),
    sc2 = require('sc2-sdk'),
    peer = require('../models/peer'),
    activity = require('../models/activity'),
    config = require('../configs/config'),
    cookie = require('cookie-parser');
	
let api = sc2.Initialize({
    app: config.sc2_app_name,
    callbackURL: '_',
    accessToken: 'access_token',
    scope: config.sc2_scope_array
});
    
    
//JSON.parse() is not asynchronous hence without this setup might not execute
async function asyncParser(data) {
    return JSON.parse(data);
}
    
module.exports = function (app) {
	
    app.post('/api/login', async function (req, res) {
		
        try {
		
            //first extract client-sent auth details
            var client_account = req.body.username,
                client_token = req.body.access_token,
                client_expiry = req.body.expires_in,
                client_state = req.body.state;
			
            //fetch data from sc2 to verify client-sent account on server side since we should never trust client input
            api.setAccessToken(client_token);
			
            var sc2_user = await api.me();
            var sc2_account = sc2_user.user;
			
            //check if sc2 auth verified user is the same as the one from the user
            if (client_account == sc2_account) {
			
                //yes, user and their auth match! now we can trust the auth key for the particular user account
				
                var steemid = sc2_user.account.id;
				
                var about = '..';
                var user_location = '..';
				
                if ( typeof sc2_user.account.json_metadata === 'string') {
					
                    //var json_metadata = JSON.parse(sc2_user.account.json_metadata);
                    var json_metadata = await asyncParser(sc2_user.account.json_metadata);
					
                    if ( typeof json_metadata.profile  !== 'undefined' && typeof json_metadata.profile.about === 'string') about = json_metadata.profile.about;
                    if ( typeof json_metadata.profile  !== 'undefined' && typeof json_metadata.profile.location === 'string') user_location = json_metadata.profile.location;
					
                }
				
                var now = new Date();
				
                var newPeer = {
					
                    steemid: steemid,
                    account: client_account,
                    last_update: now,
                    last_login: now,
                    about: about,
                    location: user_location,
                    $inc : {'login_count' : 1}
			
                };
				
				
                //not:	`.save` function else create errors when there is a duplicate
                var query = {account: client_account};
                var options = { upsert: true, new: true, runValidators: true, 'fields': { 'login_count':1, 'id': -1} };
                var response = await peer.findOneAndUpdate( query, newPeer, options );
				
				
                var action = 'sign_in';
                var description = '@' + client_account + ' just logged in';
				
				
                if (response.login_count == 1) {	//new account, first login!
					
                    action = 'sign_up';
                    description = '@' + client_account + ' just joined the community';
					
                    var newestPeer = {
                        created: now,
                        project_count: 0,
                        query_count: 0,
                        report_count: 0,
                        badge: 'observer',
                        last_project_slug_id: '#',
                        last_project_title: ''
                    };
                    
                    var newest = await peer.findOneAndUpdate( {account: client_account}, newestPeer, { 'fields': { 'id': 1}} );
					
                }
				
				
                var newActivity = activity({
				
                    title: 'New user signup',
                    slug: '/@' + client_account,
                    action: action,
                    type: 'user',
                    source: 'user',
                    account: client_account,
                    description: description,
                    created: Date.now()
				
                });
			
                await newActivity.save();
			
				
                //now send auth details as jwt
                var secret = Buffer.from(process.env.JWT_SECRET, 'hex');
				
                //encrypt access tokens
                var secured_access_token = await encryptor.encrypt(client_token, process.env.RANDOM_KEY_SECRET);
				
                var date = new Date();
                date = date.setDate(date.getDate() + 2);
			
                var payload = {
                    account: sc2_account,
                    auth: secured_access_token,
                    exp: Math.floor(Date.now() / 1000) + client_expiry * 1000 /*convert seconds to milliseconds*/
                };
			
                var token = jwt.sign(payload, secret);
				
                //todo/production: make sure cookies are sent only over HTTPS
                res.status(200)
                    .cookie('_auth', token, { maxAge: client_expiry * 1000 /*convert seconds to milliseconds*/ , httpOnly: true, signed: true })
                    .send('successfully logged in');
                //now the client side will redirect user to their state
				
            } else {
			
                //user supplied a false input
                res.status(403).clearCookie('_auth').send('sorry, invalid auth details');
			
            }
            
            
        } catch (err){
            //err processing auth
            res.status(500).clearCookie('_auth').send('sorry, error processing login');
            console.log(err);
        }
		
		
    });
	
	
    app.get('/api/private/auth', async function (req, res) {
		
        var access_token = await encryptor.decrypt(req.active_user.auth, process.env.RANDOM_KEY_SECRET);
        res.status(200).json({access_token: access_token});
		
    });
	
	
};

