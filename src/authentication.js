const authentication = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');
const local = require('feathers-authentication-local');

const authenticateToZendesk = require('./hooks/authenticate-to-zendesk');

module.exports = function() {
	const app = this;
	const config = app.get('authentication');

	// Set up authentication with the secret
	app.configure(authentication(config));
	app.configure(jwt());
	app.configure(local());

	// The `authentication` service is used to create a JWT.
	// The before `create` hook registers strategies that can be used
	// to create a new valid JWT (e.g. local or oauth2)
	app.service('authentication').hooks({
		before: {
			create: [
				authenticateToZendesk()
			],
			remove: [
				authentication.hooks.authenticate('jwt')
			]
		}
	});
};
