//admin content view
define( [
	'jquery',
	'underscore',
	'backbone',
	'text!views/templates/adminContent.html'
], function( $, _, Backbone, adminContentView ){

	var adminContent = Backbone.View.extend({

		template: _.template( adminContentView ),

		initialize: function(){

		},

		render: function(){

			$(this.el).append(this.template);
		}

	});

	return adminContent;
});