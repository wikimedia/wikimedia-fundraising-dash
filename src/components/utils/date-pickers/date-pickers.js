define( [
    'knockout',
    'text!components/utils/date-pickers/date-pickers.html'
], function( ko, template ){


    function DatePickerViewModel( params ){

        this.chosen_time_period = ko.computed( function(){
            return "Every 15 Minutes";
        });

        this.submitTimePeriod = function(){
            console.log('the time period was submitted');
        };

        this.show_increment_selection = function(){
            console.log('this will show increment selectors');
        };

        this.show_custom_selection = function(){
            console.log('this will show custom selectors');
        };

        this.shouldShowIncrements = ko.computed( function(){
            return false;
        });
        this.shouldShowCustom = ko.computed( function(){
            return false;
        });

    }

    return { viewModel: DatePickerViewModel, template: template };

});