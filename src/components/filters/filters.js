define( [
	'knockout',
	'jquery',
	'text!components/filters/filters.html'
	],
function( ko, $, template ){

	function FiltersViewModel( params ){
		var self = this;

		this.filters = ko.observableArray( [] );
		this.setChoices = function() {
			var qs = '', choices = {};
			$.each( self.filters(), function( i, filter ) {
				var filterQs = filter.queryString();
				if ( !filterQs || filterQs === '' ) {
					return;
				}
				if ( qs === '' ) {
					qs += '$filter=(';
				} else {
					qs += ' and (';
				}
				qs += filterQs;
				qs += ')';
				choices[filter.name] = filter.userChoices();
			} );
			params.queryString( qs );
			params.userChoices( choices );
			params.change();
		};

		params.metadataRequest.then( function( metadata ) {
			$.each( metadata.filters, function( name, filterMeta ) {
				var filter = {
					name: name,
					metadata: filterMeta,
					queryString: ko.observable('')
				};
				if ( filterMeta.type === 'dropdown' ) {
					filter.userChoices = ko.observableArray( params.userChoices()[name] || [] );
				} else {
					return;//temporarily only doing dropdown filters
					//filter.userChoices = ko.observable( params.userChoices()[name] );
				}
				filter.queryString.subscribe( self.setChoices );
				self.filters.push( filter );
			} );
		} );
	}

	return { viewModel: FiltersViewModel, template: template };
} );
