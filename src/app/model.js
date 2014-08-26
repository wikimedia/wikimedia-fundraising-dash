var fs              = require( 'fs' ),
    models          = {},
    relationships   = {};

var modelIndex = function modelIndex(){

    var Sequelize = require( "sequelize" ),
        sequelize,
        modelsPath;

        this.setup = function( path, database, username, password, obj ){
            modelsPath = path;

            if( arguments.length === 3 ){
                sequelize = new Sequelize( database, username );
            }
            else if(arguments.length === 4){
                sequelize = new Sequelize(database, username, password);
            }
            else if(arguments.length === 5){
                sequelize = new Sequelize(database, username, password, obj);
            }
            init();
        };

        this.model = function(name){
            return models[name];
        };

        this.Seq = function(){
            return Sequelize;
        };

        function init(){
            fs.readdirSync( modelsPath ).forEach( function( name ){
                if(name !== '.DS_Store' && name !== 'model.js'){
                    console.log('models path: ', modelsPath);
                    var object = require( modelsPath + "/" + name ),
                        options = object.options || {},
                        modelName = name.replace(/\.js$/i, "");

                    models[modelName] = sequelize.define( modelName, object.model, options );
                    if("relations" in object){
                        relationships[modelName] = object.relations;
                    }
                }
            });
            console.log('models: ', models);
            for( var name in relationships ){
                var relation = relationships[name];
                for(var relName in relation){
                    var related = relation[relName];
                    console.log('related: ', related);
                    models[name][relName](models[related]);
                }
            }
        }

        if( modelIndex.caller !== modelIndex.getInstance ){
            throw new Error('This obj cannot be instantiated');
        }
};

modelIndex.instance = null;

modelIndex.getInstance = function(){
    if(this.instance === null) {
        this.instance = new modelIndex();
    }
    return this.instance;
};

module.exports = modelIndex.getInstance();