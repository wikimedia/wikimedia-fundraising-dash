// This subview's job is to handle dates across all views.

define([
	'jquery',
	'underscore',
	'backbone',
	'utils/colors',
	'text!views/templates/date.html',
	'handlebars',
	'momentjs'
],
function($, _, Backbone, Colors, widgetTemplate, Handlebars){

	var DateView = Backbone.View.extend({

		initialize: function(){

			this.el = '#widgetSection';
			this.template = Handlebars.compile(widgetTemplate);
			this.context = {today: this.today};
			this.html = this.template(this.context);

		},

		render: function(){

			$(this.el).append( this.html );

		},

		today: function(){
			return moment().format('MMMM Do, YYYY');
		}
	});

	return DateView;

});