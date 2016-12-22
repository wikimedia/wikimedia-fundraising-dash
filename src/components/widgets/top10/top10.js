define( [
	'knockout',
	'text!components/widgets/top10/top10.html',
	'momentjs',
	'numeraljs',
	'WidgetBase'
], function ( ko, template, moment, numeral, WidgetBase ) {

	function Top10ViewModel( params ) {

		WidgetBase.call( this, params );

		var self = this;

		self.title = ko.observable( params.title );
		self.queryStringSQL = ko.observable( 'This widget hasn\'t been set up yet!' );
		self.days = ko.observableArray();
		self.hours = ko.observableArray();

		self.loadData = function () {
			var r,
				i,
				hours = [],
				days = [],
				results = self.retrievedResults();

			for ( i = 0; i < results.length; i++ ) {
				r = results[ i ];
				if ( r.hour === -1 ) {
					days.push( {
						date: r.year + '-' + r.month + '-' + r.day,
						total: numeral( r.usd_total ).format( '$0,0' )
					} );
				} else {
					hours.push( {
						hour: r.year + '-' + r.month + '-' + r.day + ' ' + r.hour + ':00',
						total: numeral( r.usd_total ).format( '$0,0' )
					} );
				}
			}
			self.days( days );
			self.hours( hours );
		};

		self.reloadData = function () {
			self.getChartData( self.filterQueryString() ).then( function () {
				self.loadData();
			} );
		};

		self.submitModifications = function () {
			self.logStateChange( true );
			self.reloadData();
		};

		self.reloadData();
	}

	return { viewModel: Top10ViewModel, template: template };
} );
