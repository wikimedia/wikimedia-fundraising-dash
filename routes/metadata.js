var widgets = require('../widgets');

module.exports = function(req, res) {
	var widget = widgets[req.params.widget];
	res.json({
		name: widget.name,
		filters: widget.filters
	});
};