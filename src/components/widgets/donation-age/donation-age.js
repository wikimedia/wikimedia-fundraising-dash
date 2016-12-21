define( [
	'knockout',
	'jquery',
	'text!components/widgets/donation-age/donation-age.html',
	'momentjs',
	'WidgetBase'
], function ( ko, $, template, moment, WidgetBase ) {

	function DonationAgeViewModel( params ) {

		WidgetBase.call( this, params );

		var self = this;

		self.title = ko.observable( params.title );
		self.queryStringSQL = ko.observable( 'This widget hasn\'t been set up yet!' );
		self.averageAgeCivi = ko.observable( '...' );
		self.averageAgeInitial = ko.observable( '...' );

		// Reload the data.  For the automatic reload, we're fine getting
		// something from the cache.
		self.reloadData = function ( automatic ) {
			self.dataLoading( true );
			var url = '/data/donation-age';
			if ( automatic !== true ) {
				url += '?cache=false';
			}
			$.get( url, function ( dataget ) {
				self.averageAgeCivi( moment.duration( dataget.results[ 0 ].age, 'seconds' ).humanize() );
				self.averageAgeInitial( moment.duration( dataget.results[ 1 ].age, 'seconds' ).humanize() );
				self.dataLoading( false );
				self.queryStringSQL( dataget.sqlQuery );
			} );
			// Do it every 5 minutes as well
			setTimeout( function () {
				self.reloadData( true );
			}, 300000 );
		};
		self.reloadData( true );
	}

	return { viewModel: DonationAgeViewModel, template: template };
} );
