define( [
	'knockout',
	'text!components/filters/text-filter/text-filter.html',
	'operators'
], function ( ko, template, ops ) {

	function TextFilterViewModel( params ) {
		var self = this;

		this.operators = [
			ops.eq,
			ops.startswith,
			ops.endswith,
			ops.substringof
		];
		this.selectedOperator = ko.observable( params.userChoices().operator || 'eq' );
		this.value = ko.observable( params.userChoices().value || '' );

		this.changed = function () {
			var value = self.value(),
				parts;

			params.userChoices( {
				operator: self.selectedOperator(),
				value: value
			} );

			if ( value === '' ) {
				params.queryString( '' );
				return;
			}
			parts = self.selectedOperator().split( '|' );

			if ( parts.length === 1 ) {
				params.queryString( params.name + ' ' + parts[ 0 ] + ' \'' + value + '\'' );
				return;
			}
			params.queryString( parts[ 1 ] + '(\'' + value + '\',' + params.name + ')' );
		};

		this.selectedOperator.subscribe( this.changed );
		this.value.subscribe( this.changed );
		this.changed();
	}

	return { viewModel: TextFilterViewModel, template: template };
} );
