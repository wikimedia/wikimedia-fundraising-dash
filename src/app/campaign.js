define( function () {

	function msToDays( ms ) {
		return Math.round( ms / ( 24 * 60 * 60 * 1000 ) );
	}

	function Campaign( params ){
		var currentYear = new Date( Date.UTC() ).getFullYear();

		this.startDate = new Date( params.startDate ||
			Date.UTC( currentYear, 11, 1 ) );
		this.endDate = new Date( params.endDate ||
			Date.UTC( currentYear + 1, 0, 1 ) );
		this.name = params.name || currentYear.toString();
	}

	Campaign.prototype.getDayOfYearOffset = function () {
		var diff,
			campaignStart = new Date(
				this.startDate.getUTCFullYear(),
				this.startDate.getUTCMonth(),
				this.startDate.getUTCDate()
			),
			startOfYear = new Date( campaignStart );

		startOfYear.setMonth(0);
		startOfYear.setDate(1);
		diff = campaignStart.getTime() - startOfYear.getTime();

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
} );
