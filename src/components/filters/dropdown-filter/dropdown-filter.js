define( [
	'knockout',
	'jquery',
	'text!components/filters/dropdown-filter/dropdown-filter.html'
], function ( ko, $, template ) {

	function DropdownFilterViewModel( params ) {
		var i, numValues;

		this.opt = [];
		this.selectedValues = params.userChoices;

		if ( !params.metadata.labels ) {
			params.metadata.labels = params.metadata.values;
		}
		numValues = params.metadata.values.length;
		for ( i = 0; i < numValues; i++ ) {
			this.opt[ i ] = {
				text: params.metadata.labels[ i ],
				value: params.metadata.values[ i ]
			};
		}

		this.setQueryString = function ( vals ) {
			var qs = '';
			$.each( vals, function ( i, value ) {
				if ( i > 0 ) {
					qs += ' or ';
				}
				qs += params.name + ' eq \'' + value + '\'';
			} );
			params.queryString( qs );
		};

		this.selectedValues.subscribe( this.setQueryString );
		this.setQueryString( this.selectedValues() );
	}

	return { viewModel: DropdownFilterViewModel, template: template };
} );
