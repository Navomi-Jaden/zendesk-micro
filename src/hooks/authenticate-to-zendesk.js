const axios = require('axios');

module.exports = function(options = {}) { // eslint-disable-line no-unused-vars
	return function authenticateToZendesk(hook) {
		let app = hook.app;
		
		return new Promise(function(resolve, reject) {
			let strategy = hook.data.strategy || '';
			
			let url = hook.data.url || '';
			let redirect = hook.data.redirect || '';
			let token = (hook.params.headers.authorization || hook.data.access_token || hook.data.code || '').replace(/Bearer\s/, '');
			let client_id = hook.data.client_id || '';
			let client_secret = hook.data.client_secret || '';
			
			if (strategy !== '' && url !== '') {
				if (token !== '') {
					if (strategy === 'local') {
						if (hook.path === 'authentication') {
							return axios.post(`${url}/oauth/tokens`, {
								grant_type: 'authorization_code',
								code: token,
								client_id,
								client_secret,
								redirect_uri: redirect,
								scope: 'read write'
							}).then(res => {
								if (res.data.access_token) {
									hook.result = app.passport.createJWT({
										url,
										iss: app.passport.options('jwt').jwt.issuer,
										access_token: res.data.access_token
									}, { secret: app.passport.options('jwt').secret });
									
									return resolve(hook);
								}
								
								return reject(res.data);
							}).catch(err => {
								return reject(err);
							});
						}
						
						return reject('Local is only available on the /authentication path');
					} else if (strategy === 'jwt') {
						return app.passport.verifyJWT(token, { secret: app.passport.options('jwt').secret }).then(res => {
							if (hook.path === 'authentication')
								hook.result = res;
							else
								hook.params.payload = res;
							
							return resolve(hook);
						}).catch(err => {
							return reject(err);
						});
					}
					
					return reject('Strategy must either be `local` or `jwt`.');
				}
				
				return reject('A token (auth code or access token) must be provided.');
			}
			
			return reject('`url` and `strategy` must be defined.');
		});
	};
};
