//app content view
define( [
	'jquery',
	'underscore',
	'backbone',
	'views/library',
	'views/welcome',
	'text!views/templates/appContent',
	'utils/dispatcher'
], function( $, _, Backbone, libraryView, welcomeView, appContent, dispatcher ){

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
			//this.welcome = new welcomeView({el: '#appContent'});

		},

		render: function(){

			this.library.render();

			$(this.el).append(this.template);
		}

	});

	return AppContent;
});