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
			var filters = [];
			$.each( metadata.filters, function( name, filterMeta ) {
				var filter = {
					name: name,
					metadata: filterMeta,
					queryString: ko.observable('')
				};
				switch( filterMeta.type ) {
					case 'dropdown':
						filter.userChoices = ko.observableArray( params.userChoices()[name] || [] );
						break;
					case 'text':
					case 'number':
						filter.userChoices = ko.observable( params.userChoices()[name] || {} );
						break;
					default:
						//not yet supported filter type
						return;
				}
				filter.queryString.subscribe( self.setChoices );
				filters.push( filter );
			} );
			//sort filters by type then display name
			filters.sort( function( a, b ) {
				var aMeta = a.metadata,
					bMeta = b.metadata;

				if ( aMeta.type > bMeta.type ) {
					return 1;
				}
				if ( aMeta.type < bMeta.type ) {
					return -1;
				}
				if ( aMeta.display > bMeta.display ) {
					return 1;
				}
				if ( aMeta.display < bMeta.display ) {
					return -1;
				}
				return 0;
			} );
			self.filters( filters );
		} );
	}

	return { viewModel: FiltersViewModel, template: template };
} );
