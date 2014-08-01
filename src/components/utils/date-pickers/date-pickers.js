define( [
    'knockout',
    'text!components/utils/date-pickers/date-pickers.html'
], function( ko, template ){


    function DatePickerViewModel( params ){
        var self= this;

        self.chosenTimePeriod = ko.computed( function(){
            return "Every 15 Minutes";
        });

        self.submitTimePeriod = function(){
            console.log('the time period was submitted');
        };

        self.shouldShowIncrements = ko.computed( function(){
            return true;
        });

        self.shouldShowCustom = ko.computed( function(){
            return true;
        });

        self.availableTimePresets = ko.observableArray([
                    'Select:',
                    'Last 15 Minutes',
                    'Last Hour',
                    'Last 24 Hours',
                    'Last 5 Minutes'
        ]);

        self.availableIncrementTypes = ko.observableArray([
                    'Select:',
                    'Hour...',
                    'Day...',
                    'Week...',
                    'Month...',
                    'Year...'
        ]);

        self.selectedIncrement = ko.observable();

        self.getIncrementSubmenu = ko.computed( function(){

        });

    }

    return { viewModel: DatePickerViewModel, template: template };

});