
'use strict';

module.exports = function router(layout, req, res) {
	
	if (req.active_user) {
		res.render(layout, {
			username: req.active_user.account,
			data: res.req_data || ''
		})
	} else {
		res.render(layout, {
			username: null,
			data: res.req_data || ''
		})
	}
	
	return res.end();
	
}
