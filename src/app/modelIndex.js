var orm = require('../models/model.js');

exports.user = function(res, req){

    var User = orm.model("User");

    User.find(1).success( function( user ){
        user.getNames().success( function( names ){
            response.send( names );
        });
    });
};