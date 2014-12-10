define( [
    'knockout',
    'text!components/widgets/x-by-y-chart/x-by-y-chart.html',
    'momentjs',
    'numeraljs',
    'chartjs',
    'select2'
], function( ko, template, moment, numeral, Chart, select2 ){


    function XByYChartViewModel( params ){

        var self = this;
        self.xyIsSetUp = ko.observable(false);
        self.chartWidth = ko.observable('900');
        self.chartHeight = ko.observable('550');
        self.showSlice = ko.observable();
        self.bySlice = ko.observable();
        self.timeChoice = ko.observable();

        //this is a placeholder.
        //TODO: break the filters into their parent groups to work with the multi-select box.
        self.filters = ko.observableArray(['Country', 'Currency', 'Gateway', 'Campaign', 'Referrer']);
        self.chosenFilters = ko.observableArray([]);
        self.addFilter = function(filter){
        	console.log(filter);
        	self.chosenFilters.push(filter);
        };

        self.title = ko.computed(function(){
        	return self.showSlice() + ' by ' + self.bySlice();
        });

        //saved charts
        //TODO: these will trigger a saved set of parameters to draw the chart with.
        self.presetTitles = ko.observableArray([
        	'Donations During Big English 2014',
        	'Donations for Fiscal Year 2014'
        ]);
        ///////

        self.ySlices = ko.observableArray([
        	'Donations',
        	'Failed Donations'
        ]);

        self.xSlices = ko.observableArray([
        	'Country',
        	'Currency',
        	'Method',
        	'Source',
        	'Campaign',
        	'Medium',
        	'Referrer',
        	'Gateway',
        	'Fraud Score'
        ]);

        self.timeChoices = ko.observableArray([
        	'Month',
        	'Week',
        	'Day',
        	'Hour',
        	'Minute',
        	'Second'
        ]);

        self.submitXY = function(){
        	self.fakeData = {
		    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		    datasets: [
		        {
		            label: 'My First dataset',
		            fillColor: 'rgba(220,220,220,0.2)',
		            strokeColor: 'rgba(220,220,220,1)',
		            pointColor: 'rgba(220,220,220,1)',
		            pointStrokeColor: '#fff',
		            pointHighlightFill: '#fff',
		            pointHighlightStroke: 'rgba(220,220,220,1)',
		            data: [65, 59, 80, 81, 56, 55, 40]
		        },
		        {
		            label: 'My Second dataset',
		            fillColor: 'rgba(151,187,205,0.2)',
		            strokeColor: 'rgba(151,187,205,1)',
		            pointColor: 'rgba(151,187,205,1)',
		            pointStrokeColor: '#fff',
		            pointHighlightFill: '#fff',
		            pointHighlightStroke: 'rgba(151,187,205,1)',
		            data: [28, 48, 40, 19, 86, 27, 90]
		        }
		    ]
		};
		var ctx = $('#x-by-yChart').get(0).getContext('2d');
		self.fakeChart = new Chart(ctx).Line(self.fakeData);

	        self.xyIsSetUp(true);
        };

        $('#selectXYFilters').select2();



    }

    return { viewModel: XByYChartViewModel, template: template };

});
