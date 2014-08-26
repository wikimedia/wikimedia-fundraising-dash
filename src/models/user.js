var orm = require('../app/model.js'),
	Seq = orm.Seq();

module.exports = {
	model: {
		id: Seq.INTEGER,
		name: Seq.STRING
	},

	// TODO: this is boilerplate for models. Set up as needed.
	relations: {},

	options: {}
};
