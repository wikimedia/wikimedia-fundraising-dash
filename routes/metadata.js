var widgets = require('../widgets');

module.exports = function(req, res) {
	var widget = widgets[req.params.widget];
	if ( !widget ) {
		res.json( { error: 'Error: ' + req.params.widget + ' is not a valid widget' } );
		return;
	}
	res.json({
		name: widget.name,
		filters: widget.filters
	});
};