define( [
    'knockout',
    'text!components/widgets/x-by-y-chart/x-by-y-chart.html',
    'momentjs',
    'numeraljs',
    'chartjs'
], function( ko, template, moment, numeral, Chart ){


    function XByYChartViewModel( params ){

        var self = this;
        self.title = ko.observable('This is the title');
        self.xyIsSetUp = ko.observable(true);
        self.chartWidth = ko.observable('900');
        self.chartHeight = ko.observable('550');

        self.makeChart = function(){
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
        };

        if(self.xyIsSetUp){
        	self.makeChart();
		}

        self.submitXY = function(){
        	self.xyIsSetUp(true);
        	self.makeChart();
        };



    }

    return { viewModel: XByYChartViewModel, template: template };

});
