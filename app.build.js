/* jshint -W098 */
({
	baseUrl: 'src',
	paths: {
		bootstrap: 'bower_modules/bootstrap/dist/js/bootstrap',
		crossroads: 'bower_modules/crossroads/dist/crossroads.min',
		hasher: 'bower_modules/hasher/dist/js/hasher.min',
		jquery: 'bower_modules/jquery/dist/jquery',
		noUISlider: 'bower_modules/nouislider/distribute/jquery.nouislider.all',
		knockout: 'bower_modules/knockout/dist/knockout',
		'knockout-projections': 'bower_modules/knockout-projections/dist/knockout-projections',
		d3: 'bower_modules/d3/d3',
		text: 'bower_modules/requirejs-text/text',
		chartjs: 'bower_modules/chartjs/Chart',
		momentjs: 'bower_modules/moment/moment',
		raphael: 'bower_modules/raphael/raphael',
		gauge: 'bower_modules/gauge.js/dist/gauge',
		'bootstrap-datepicker': 'bower_modules/bootstrap-datepicker/js/bootstrap-datepicker',
		'bootstrap-timepicker': 'bower_modules/bootstrap-timepicker/js/bootstrap-timepicker',
		select2: 'bower_modules/select2/select2',
		signals: 'bower_modules/js-signals/dist/signals.min',
		c3: 'bower_modules/c3/c3',
		numeraljs: 'bower_modules/numeraljs/numeral',
		WidgetBase: 'app/widgetBase',
		Campaign: 'app/campaign',
		operators: 'components/filters/operators',
			requireLib: 'bower_modules/requirejs/require'
	},
	shim: {
		bootstrap: {
			deps: [
				'jquery'
			]
		},
		c3: {
			deps: [
				'd3'
			]
		},
		momentjs: {
			exports: 'moment'
		},
		noUISlider: {
			deps: [
				'jquery'
			]
		}
	},
	out: 'scripts.js',
		name: 'app/startup',
		include: [
			'requireLib',
			'components/app-content/app-content',
			'components/boards/generic-board/generic-board',
			'components/filters/filters',
			'components/filters/dropdown-filter/dropdown-filter',
			'components/filters/number-filter/number-filter',
			'components/filters/text-filter/text-filter',
			'components/nav-bar/nav-bar',
			'components/utils/date-pickers/date-pickers',
			'components/widgets/ab-testing/ab-testing',
			'components/widgets/amt-per-second-chart/amt-per-second-chart',
			'components/widgets/cat-trombone/cat-trombone',
			'components/widgets/distance-to-goal-chart/distance-to-goal-chart',
			'components/widgets/donation-age/donation-age',
			'components/widgets/fraud-gauge/fraud-gauge',
			'components/widgets/top10/top10',
			'components/widgets/totals-earned-chart/totals-earned-chart',
			'components/widgets/x-by-y/x-by-y'
		],
		insertRequire: [ 'app/startup' ],
		bundles: {
			// If you want parts of the site to load on demand, remove them from the 'include' list
			// above, and group them into bundles here.
			'date-pickers': [ 'components/utils/date-pickers/date-pickers' ]
			// 'vega-timeseries': ['components/visualizers/vega-timeseries/vega-timeseries']

		}
})
