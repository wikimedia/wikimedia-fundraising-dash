// This subview's job is to handle dates across all views.

define([
	'jquery',
	'underscore',
	'backbone',
	'utils/colors',
	'text!views/templates/date.html',
	'momentjs'
],
function($, _, Backbone, Colors, widgetTemplate){

	var DateView = Backbone.View.extend({

		initialize: function(){

			this.el = '#widgetSection';
			this.template = _.template(widgetTemplate);

		},

		render: function(){

			console.log(this.today());
			$(this.el).append( this.template );

		},

		today: function(){
			return "Today is " + moment().format('MMMM Do, YYYY');
		}
	});

	return DateView;

});