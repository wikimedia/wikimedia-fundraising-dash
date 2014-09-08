module.exports = function(sequelize, Seq) {
    var User = sequelize.define('User', {
		id: Seq.INTEGER,
		name: Seq.STRING
	});

    return User;
};
