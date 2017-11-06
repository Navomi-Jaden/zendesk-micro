const zendeskOAuth = require('./zendesk-oauth');
module.exports = function () {
	const app = this; // eslint-disable-line no-unused-vars
	app.use(zendeskOAuth());
};
