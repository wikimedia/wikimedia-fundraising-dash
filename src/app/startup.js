define( [
	'jquery',
	'knockout',
	'./router',
	'bootstrap',
	'knockout-projections',
	'./bindings'
], function ( $, ko, router ) {
	ko.components.register( 'dashboard', { require: 'components/dashboard/dashboard' } );
	ko.components.register( 'home', { require: 'components/home/home' } );
	ko.components.register( 'nav-bar', { require: 'components/nav-bar/nav-bar' } );
	ko.components.register( 'app-content', { require: 'components/app-content/app-content' } );

	// register utils
	ko.components.register( 'date-pickers', { require: 'components/utils/date-pickers/date-pickers' } );

	// register boards
	ko.components.register( 'generic-board', { require: 'components/boards/generic-board/generic-board' } );
	// register filters
	ko.components.register( 'filters', { require: 'components/filters/filters' } );
	ko.components.register( 'dropdown-filter', { require: 'components/filters/dropdown-filter/dropdown-filter' } );
	ko.components.register( 'number-filter', { require: 'components/filters/number-filter/number-filter' } );
	ko.components.register( 'text-filter', { require: 'components/filters/text-filter/text-filter' } );

	// register individual widgets
	ko.components.register( 'ab-testing', { require: 'components/widgets/ab-testing/ab-testing' } );
	ko.components.register( 'amt-per-second-chart',
		{ require: 'components/widgets/amt-per-second-chart/amt-per-second-chart' } );
	ko.components.register( 'cat-trombone', { require: 'components/widgets/cat-trombone/cat-trombone' } );
	ko.components.register( 'distance-to-goal-chart',
		{ require: 'components/widgets/distance-to-goal-chart/distance-to-goal-chart' } );
	ko.components.register( 'donation-age', { require: 'components/widgets/donation-age/donation-age' } );
	ko.components.register( 'fraud-gauge', { require: 'components/widgets/fraud-gauge/fraud-gauge' } );
	ko.components.register( 'top10', { require: 'components/widgets/top10/top10' } );
	ko.components.register( 'totals-earned-chart',
		{ require: 'components/widgets/totals-earned-chart/totals-earned-chart' } );
	ko.components.register( 'x-by-y', { require: 'components/widgets/x-by-y/x-by-y' } );

	// fire up router
	ko.applyBindings( { route: router.currentRoute } );

} );
