// eslint-disable-next-line no-unused-vars
var require = {
	baseUrl: '.',
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
		operators: 'components/filters/operators'
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
	}
};
