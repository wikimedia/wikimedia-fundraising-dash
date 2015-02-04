define( [
    'knockout',
    'text!components/widgets/x-by-y/x-by-y.html',
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

        self.queryStringXYsql = ko.observable('This widget hasn\'t been set up yet!');
        self.queryRequest = {};
        self.chosenFilters = ko.observableArray();
        self.subChoices = ko.observableArray();

        self.chartSaved = ko.observable(false);
        self.optionStateChanged = ko.observable(false);
        self.logStateChange = function(n){
            self.optionStateChanged(n);
            self.chartSaved(false);
        };

        self.title = ko.computed(function(){
        	return self.showSlice() + ' by ' + self.bySlice();
        });

        self.showPanelBody = function(area){
            $('#'+area+'body').toggleClass('hide');
        };

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

        self.xSlices = ko.observableArray();

        self.timeChoices = ko.observableArray();

        self.groupChoices = ko.observableArray();

        //populate user choices dynamically
        self.populateChoices = (function(){
            //populate y slices
            //TODO: this one will be user-defined, and developed in full later
            //since right now the specifics are a bit obscured.
            $.get( 'metadata/x-by-y', function(reqData){
              self.metadata = reqData;


                var xArray = [], timeArray = [], groupArray = [];
                $.each(self.metadata.filters, function(prop, obj){

                    if(obj.type !== 'number' || prop === 'Amount'){

                        if(obj.canGroup){
                            if(obj.values){
                                groupArray.push({ 'name': prop, 'choices': obj.values });
                            }

                            $('select #'+prop).select2();

                            //TODO: later this will do something different/more specific.
                            xArray.push(prop);
                        }


                    } else {
                        timeArray.push(prop);
                    }
                });
                self.xSlices(xArray);
                self.timeChoices(timeArray);
                self.groupChoices(groupArray);

            });

        })();

        self.convertToQuery = function( userChoices ){
            //y slice
            //right now this doesn't matter because it's always 'donations'

            var groupStr = 'group=' + userChoices.xSlice;

            //additional filters:
            if( userChoices.additionalFilters.length > 0 ){

                var filterStr = '$filter=';

                var filterObj = {}, haveMultipleSubfilters = [];
                $.each( userChoices.additionalFilters, function(el, subfilter){
                    var filter = subfilter.substr(0, subfilter.indexOf(' '));
                    if(!filterObj[filter]){
                      filterObj[filter] = subfilter;
                    } else {
                      filterObj[filter] += ' or ' + subfilter;
                      haveMultipleSubfilters.push(filter);
                    }
                });

                $.each( filterObj, function(el, s){
                    if( haveMultipleSubfilters.indexOf(el) > -1){
                      filterStr += '(' + filterObj[el] + ')';
                    } else {
                      filterStr += filterObj[el];
                    }
                    filterStr += ' and ';
                });

                //cut off last AND
                if( filterStr !== '$filter=' ){
                    return groupStr + '&' + (filterStr.slice(0, -5));
                } else {
                    return groupStr;
                }
            } else {
                return groupStr;
            }
        };

        self.saveXY = function(){
            //TODO: save it in the user profile
            self.chartSaved(true);
        };

        self.submitXY = function(){

            //here is an example query string for grabbing Big English countries by day for Dec:
            // http://localhost:8080/data/x-by-y?group=Day&group=Country&$filter=DT gt
            //'2014-12-01T00:00:00Z' and Country eq 'US' or Country eq 'CA' or Country eq 'NZ'
            //or Country eq 'AU' or Country eq 'GB'

            //get all the choices into a queryRequest object
            self.queryRequest.ySlice = self.showSlice();
            self.queryRequest.xSlice = self.bySlice();
            self.queryRequest.additionalFilters = self.chosenFilters();
            var queryString = self.convertToQuery(self.queryRequest);

            $.get( '/data/x-by-y?' + (queryString).replace(
          /\+/g, '%20' ), function ( dataget ) {
                console.log('dataget: ', dataget);
            });

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

    }

    return { viewModel: XByYChartViewModel, template: template };

});
