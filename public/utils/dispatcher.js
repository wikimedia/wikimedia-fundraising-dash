define([
    'jquery',
    'underscore',
    'backbone'
    ],
function($, _, Backbone){
	var dispatcher = _.clone(Backbone.Events);

	dispatcher.goToLibrary = function(){
		alert('going to the Library');
	};

	dispatcher.on('click', function(){
		console.log('this is a dispatcher click event.');
	});

	return dispatcher;

});

