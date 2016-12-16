define( [
	'text!components/widgets/cat-trombone/cat-trombone.html',
	'WidgetBase'
], function( template, WidgetBase ) {

	function CatTromboneViewModel( params ) {
		WidgetBase.call( this, params );
	}

	return { viewModel: CatTromboneViewModel, template: template };
} );
