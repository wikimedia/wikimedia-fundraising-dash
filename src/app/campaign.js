define([
	'momentjs'
], function( moment ){

	function msToDays( ms ) {
		return Math.round( ms / ( 24 * 60 * 60 * 1000 ) );
	}

	function Campaign( params ){
		var currentYear = new Date().getFullYear();

		this.startDate = params.startDate ||
			new Date( currentYear, 11, 1 );
		this.endDate = params.endDate ||
			new Date( currentYear + 1, 0, 1 );
	}

	Campaign.prototype.getDayOfYearOffset = function () {
		var diff = startOfYear = new Date( this.startDate );

		startOfYear.setMonth(0);
		startOfYear.setDate(1);
		diff = this.startDate.getTime() - startOfYear.getTime();

		// Not a fencepost error - this should be 0 for Jan 1
		return msToDays( diff );
	}

	Campaign.prototype.getDateFilter = function () {
		var filter = '(DT gt \'' +
			this.startDate.toISOString();
		filter += '\') and (DT lt \'' +
			this.endDate.toISOString() + '\')';

		return filter;
	}

	Campaign.prototype.getLengthInDays = function () {
		var diff = this.endDate.getTime() - this.startDate.getTime();

		return msToDays( diff );
	}

	return Campaign;
});
