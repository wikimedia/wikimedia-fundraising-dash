define( [
	'knockout',
	'text!components/filters/text-filter/text-filter.html'
	],
function( ko, template ){

	function TextFilterViewModel( params ){
		var self = this;

		this.operators = [
			{
				value: 'eq',
				text: 'Exactly'
			},
			{
				value: 'fn|startswith',
				text: 'Starts with'
			},
			{
				value: 'fn|endswith',
				text: 'Ends with'
			},
			{
				value: 'fn|substringof',
				text: 'Contains'
			}
		];
		this.selectedOperator = ko.observable( params.userChoices().operator || 'eq' );
		this.value = ko.observable( params.userChoices().value || '' );

		this.changed = function() {
			params.userChoices( {
				operator: self.selectedOperator(),
				value: self.value()
			} );

			if ( self.value() === '' ) {
				params.queryString( null );
				return;
			}
			var parts = self.selectedOperator().split( '|' );

			if ( parts.length === 1 ) {
				params.queryString( params.name + ' eq \'' + self.value() + '\'' );
				return;
			}
			params.queryString( parts[1] + '(\'' + self.value() + '\',' + params.name + ')'  );
		};

		this.selectedOperator.subscribe( this.changed );
		this.value.subscribe( this.changed );
	}

	return { viewModel: TextFilterViewModel, template: template };
} );
