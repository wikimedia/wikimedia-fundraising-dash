define( [
	'knockout',
	'text!components/filters/number-filter/number-filter.html',
	'operators'
	],
function( ko, template, ops ) {

	function NumberFilterViewModel( params ) {
		var self = this;

		this.operators = [
			ops.eq,
			ops.gt,
			ops.lt,
			ops.ge,
			ops.le
		];
		this.selectedOperator = ko.observable( params.userChoices().operator || 'eq' );
		this.value = ko.observable( params.userChoices().value || '' );
		this.min = params.metadata.min;
		this.max = params.metadata.max;

		this.changed = function () {
			var value = self.value();

			params.userChoices( {
				operator: self.selectedOperator(),
				value: value
			} );

			if ( value === '' ) {
				params.queryString( '' );
				return;
			}

			params.queryString(
				params.name + ' ' + self.selectedOperator() + ' \'' + value + '\''
			);
		};

		this.selectedOperator.subscribe( this.changed );
		this.value.subscribe( this.changed );
		this.changed();
	}

	return { viewModel: NumberFilterViewModel, template: template };
} );
