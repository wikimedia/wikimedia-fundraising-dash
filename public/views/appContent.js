//app content view
define( [
	'jquery',
	'underscore',
	'backbone',
	'routers/approuter',
	'views/library',
	'text!views/templates/appContent'
], function( $, _, Backbone, router, libraryView, appContent ){

	var AppContent = Backbone.View.extend({

		template: _.template( appContent ),

		initialize: function(){

			//TODO: determine if we are doing a Library or Board view
			//if library,
				//TODO: write logic that discerns the type of library:
		        //Widget, Board, Favorite
				this.library = new libraryView({el: '#appContent'});
			//if board,
				//get default board
			//else return a welcome message

		},

		render: function(){

			$(this.el).append(this.template);

			this.library.render();

		}

	});

	return AppContent;
});