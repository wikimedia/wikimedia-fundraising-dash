define( [
	'jquery',
	'knockout',
	'operators'
], function ( $, ko, ops ) {

	function zeroPad( number ) {
		if ( number < 10 ) {
			return '0' + number;
		}
		return number;
	}

	function WidgetBase( params ) {

		var self = this,
			MAX_RETRIES = 3;

		// Things to clean up when the widget is removed
		self.disposables = [];
		self.timers = [];

		self.retrievedResults = ko.observable();
		self.queryStringSQL = ko.observable( 'This widget hasn\'t been set up yet!' );
		self.config = params.configuration || {};
		self.instanceID = params.widgetInstance;
		self.widgetCode = params.widgetCode;
		self.dataLoading = params.dataLoading;
		self.chartSaved = ko.observable( !!params.configuration );
		self.optionStateChanged = ko.observable( false );
		self.chartLoaded = ko.observable( false );
		self.title = ko.observable( params.title );
		self.userChoices = ko.observable( self.config.userChoices || {} );
		self.filterQueryString = ko.observable( self.config.filterQueryString || '' );
		self.metadataRequest = ( function () {
			var storageKey = 'metadata-' + self.widgetCode,
				data = localStorage.getItem( storageKey );

			if ( data && data.timestamp + 600000 > new Date().getTime ) {
				return $.Deferred().resolve( JSON.parse( data ) ).promise();
			}
			return $.get( 'metadata/' + self.widgetCode, function ( fetchedData ) {
				fetchedData.timestamp = new Date().getTime();
				localStorage.setItem( storageKey, JSON.stringify( fetchedData ) );
			} );
		}() );

		self.filterText = ko.computed( function () {
			var filterName,
				text,
				parts = [],
				choices = self.userChoices(),
				filterChoices,
				operator;

			for ( filterName in choices ) {
				if ( !Object.prototype.hasOwnProperty.call( choices, filterName ) ) {
					continue;
				}
				text = filterName + ' ';
				filterChoices = choices[ filterName ];
				// FIXME: this should be part of a filter base class so different
				// types of filter can define their own summary text generation
				if ( filterChoices.constructor === Array ) {
					// Dropdown filter
					if ( filterChoices.length === 0 ) {
						continue;
					}
					if ( filterChoices.length === 1 ) {
						text += '= ' + filterChoices[ 0 ];
					} else {
						text += 'in (' + filterChoices.join( ', ' ) + ')';
					}
				} else {
					// Text or numeric filter
					if ( filterChoices.value === '' ) {
						continue;
					}
					operator = ops[ filterChoices.operator.replace( 'fn|', '' ) ];
					if ( operator.abbr ) {
						text += operator.abbr;
					} else {
						text += operator.text.toLowerCase();
					}
					text += ' ' + filterChoices.value;
				}
				parts.push( text );
			}
			return parts.join( ', ' );
		} );

		self.getChartData = function ( qs, successCallback, retryCount ) {
			if ( !retryCount ) {
				retryCount = 0;
			}
			self.dataLoading( true );
			$.ajax( {
				url: '/data/' + self.widgetCode + '?' + ( qs ).replace( /\+/g, '%20' ),
				success: function ( dataget ) {
					self.dataLoading( false );
					self.retrievedResults( dataget.results );
					self.queryStringSQL( dataget.sqlQuery );
					if ( successCallback ) {
						successCallback( dataget );
					}
				},
				error: function ( req ) {
					if ( req.status === 401 ) {
						// User has been logged out. Reloading is an easy way to re-authenticate.
						window.location.reload();
					}
					if ( req.status === 504 && retryCount < MAX_RETRIES ) {
						// Retry on gateway timeout. If the previous query has finished
						// in the background, we should get a result immediately. If it
						// hasn't finished, we will be served via the same promise object
						// rather than making another database query.
						self.getChartData( qs, successCallback, retryCount + 1 );
					}
				}
			} );
		};

		self.saveWidgetConfig = function () {
			self.config.userChoices = self.userChoices();
			self.config.filterQueryString = self.filterQueryString();

			var data = JSON.stringify( {
				configuration: self.config,
				isShared: false,
				displayName: self.title()
			} );

			if ( self.instanceID ) {
				$.ajax( {
					method: 'PUT',
					url: '/widget-instance/' + self.instanceID,
					contentType: 'application/json; charset=UTF-8',
					data: data,
					success: function ( /* data */ ) {
						self.chartSaved( true );
						self.logStateChange( false );
					}
				} );
			} else {
				$.ajax( {
					method: 'POST',
					url: '/widget-instance/',
					contentType: 'application/json; charset=UTF-8',
					data: data,
					success: function ( data ) {
						self.instanceID = data.id;
						self.chartSaved( true );
						self.logStateChange( false );
					}
				} );
			}

		};

		self.processData = function ( rawdata, timescale, grouping, timestamp ) {

			var timeWord = ( timescale === 'Day' ? 'Dai' : timescale ) + 'ly',
				totals,
				counts,
				isGrouped = ( grouping && grouping !== '' ),
				groupValue,
				displayValue,
				displayValues,
				groupedTotals,
				groupedCounts,
				totalGroupNames,
				countGroupNames,
				totalName,
				countName,
				usedDates = [],
				xs = [ 'x' ],
				defaultYear = new Date().getFullYear(),
				defaultMonth = new Date().getMonth() + 1,
				tempDate, timeFormat, now = new Date( timestamp ),
				sortFunction;

			if ( isGrouped ) {
				// distinct values of the group column, mapped for display
				displayValues = [];
				// for c3 to stack totals with totals and counts with counts
				totalGroupNames = [];
				countGroupNames = [];
				// these two are populated in the first pass with e.g.
				// groupedTotals['US']['2015-12-02 15'] = 123.45
				groupedTotals = [];
				groupedCounts = [];
				// these will be populated in a second pass
				totals = [];
				counts = [];
			} else {
				totals = [ timeWord + ' Total' ];
				counts = [ timeWord + ' Count' ];
			}
			// coerce UTC into the default timezone.  Comparing offset values
			// so we only have to adjust 'now', not each data point
			now.setHours( now.getHours() + now.getTimezoneOffset() / 60 );
			$.each( rawdata, function ( index, dataPoint ) {
				var year = dataPoint.Year || defaultYear,
					month = dataPoint.Month || defaultMonth,
					day = dataPoint.Day || 1,
					hour = dataPoint.Hour || 0;

				// Filter bogons
				if ( year < 2004 || new Date( year, month - 1, day, hour ) > now ) {
					return;
				}

				tempDate = year + '-';
				tempDate += zeroPad( month ) + '-';
				tempDate += zeroPad( day );
				tempDate += ' ' + zeroPad( hour );

				if ( !usedDates[ tempDate ] ) {
					xs.push( tempDate );
					usedDates[ tempDate ] = true;
				}
				if ( isGrouped ) {
					groupValue = dataPoint[ grouping ];
					displayValue = self.getDisplayValue( grouping, groupValue );
					if ( !totals[ displayValue ] ) {
						displayValues.push( displayValue );
						totalName = displayValue + ' total';
						totals[ displayValue ] = [ totalName ];
						groupedTotals[ displayValue ] = [];
						totalGroupNames.push( totalName );
						countName = displayValue + ' count';
						counts[ displayValue ] = [ countName ];
						groupedCounts[ displayValue ] = [];
						countGroupNames.push( countName );
					}
					groupedTotals[ displayValue ][ tempDate ] = dataPoint.usd_total;
					groupedCounts[ displayValue ][ tempDate ] = dataPoint.donations;
				} else {
					// not grouped
					totals.push( dataPoint.usd_total );
					counts.push( dataPoint.donations );
				}
			} );

			if ( isGrouped ) {
				// second pass to create data arrays with an entry for each x val
				// FIXME: remove this and use the xs property
				// http://c3js.org/reference.html#data-xs
				$.each( xs, function ( index, xVal ) {
					if ( xVal === 'x' ) {
						return;
					}
					// clobber index because who cares
					$.each( displayValues, function ( index, displayVal ) {
						if ( groupedTotals[ displayVal ][ xVal ] !== undefined ) {
							totals[ displayVal ].push( groupedTotals[ displayVal ][ xVal ] );
							counts[ displayVal ].push( groupedCounts[ displayVal ][ xVal ] );
						} else {
							totals[ displayVal ].push( 0 );
							counts[ displayVal ].push( 0 );
						}
					} );
				} );
				displayValues.sort();
				totalGroupNames.sort();
				countGroupNames.sort();
				sortFunction = function ( seriesA, seriesB ) {
					return seriesA[ 0 ] < seriesB[ 0 ] ? -1 : 1;
				};
				totals.sort( sortFunction );
				counts.sort( sortFunction );
			}
			switch ( timescale ) {
				case 'Year':
					timeFormat = '%Y';
					break;
				case 'Month':
					timeFormat = '%b \'%y';
					break;
				case 'Day':
					timeFormat = '%b %e';
					break;
				case 'Hour':
					timeFormat = '%H:00';
					break;
			}
			return {
				timescale: timescale,
				totals: totals,
				counts: counts,
				xs: xs,
				timeFormat: timeFormat,
				totalGroups: totalGroupNames,
				countGroups: countGroupNames,
				groupValues: displayValues
			};
		};

		/**
		 * Look up in the metadata which label corresponds to a given value for a specific filter
		 *
		 * @param filterName string Name of filter
		 * @param value string|number Value as returned from database
		 * @returns string Label corresponding to value, or value if no labels are configured
		 */
		self.getDisplayValue = function ( filterName, value ) {
			var index;
			if ( !self.metadata.filters[ filterName ] || !self.metadata.filters[ filterName ].labels ) {
				return value;
			}
			if ( typeof value === 'number' ) {
				// Configured values are always specified as strings
				value = value.toString( 10 );
			}
			index = self.metadata.filters[ filterName ].values.indexOf( value );
			return self.metadata.filters[ filterName ].labels[ index ];
		};

		self.convertToQuery = function ( userChoices ) {

			var timeArray = [ 'Year', 'Month', 'Day', 'Hour' ],
				index = timeArray.indexOf( userChoices.timeBreakout ),
				query = 'group=' + userChoices.timeBreakout,
				filterQueryString = self.filterQueryString(),
				extraFilter,
				levelDiff;

			// If we're grouping by anything finer than year, add a filter and
			// also group by the next levels up.
			for ( levelDiff = 1; index - levelDiff >= 0; levelDiff++ ) {
				query = query + '&group=' + timeArray[ index - levelDiff ];
			}
			if ( userChoices.xSlice ) {
				query = query + '&group=' + userChoices.xSlice;
			}
			if ( index > 0 ) {
				extraFilter = timeArray[ index - 1 ] + 'sAgo lt \'1\'';
				if ( filterQueryString === '' ) {
					filterQueryString = '$filter=' + extraFilter;
				} else {
					filterQueryString = filterQueryString + ' and ' + extraFilter;
				}
			}
			if ( filterQueryString !== '' ) {
				query = query + '&' + filterQueryString;
			}

			return query;
		};

		self.logStateChange = function ( n ) {
			self.optionStateChanged( n );
			if ( n !== false ) {
				self.chartSaved( false );
			}
		};

		self.subscribe = function ( parent, member, callback ) {
			if ( !parent[ member ] ) {
				// FIXME: replace this retry crap with a promise
				window.setTimeout( function () {
					self.subscribe( parent, member, callback );
				}, 50 );
				return;
			}
			self.disposables.push( parent[ member ].subscribe( callback ) );
			callback();
		};

		self.dispose = function () {
			ko.utils.arrayForEach( self.disposables, function ( disposable ) {
				if ( disposable && disposable.dispose ) {
					disposable.dispose();
				}
			} );
			ko.utils.arrayForEach( self.timers, function ( timer ) {
				window.clearTimeout( timer );
			} );
		};

		return this;
	}

	return ( WidgetBase );

} );
