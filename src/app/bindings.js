define( [
	'knockout',
	'c3'
], function( ko, c3 ) {
	ko.bindingHandlers.c3 = {
		init: function init( element, valueAccessor, allBindingsAccessor, viewModel, bindingContext ) {
			var chart, options = ko.unwrap( valueAccessor() );
			if ( !options ) {
				return;
			}
			options.bindto = element;
			chart = c3.generate(options);
			ko.utils.domNodeDisposal.addDisposeCallback( element, function() {
				chart.destroy();
			});
			ko.utils.domData.set( element, 'chart', chart );
		},
		update: function update( element, valueAccessor, allBindingsAccessor, viewModel, bindingContext ) {
			var chart = ko.utils.domData.get( element, 'chart' ),
				options = ko.unwrap(valueAccessor());
			if ( !options ) {
				return;
			}
			if ( chart ) {
				chart.load( options.data );
				return;
			}
			options.bindto = element;
			chart = c3.generate(options);
			ko.utils.domNodeDisposal.addDisposeCallback( element, function() {
				chart.destroy();
			});
			ko.utils.domData.set( element, 'chart', chart );
		}
	};
	return true;
} );