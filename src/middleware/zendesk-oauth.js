module.exports = function (options = {}) {
	return function zendeskOAuth(req, res, next) {
		console.log('Zendesk OAuth middleware is running');
		next();
	};
};
