define( [
    'jquery',
    'underscore',
    'backbone',
    //TODO: make the retrieval of these widgets dynamic based on user
    //and board selected. Import collections rather than individual views.
    'views/widgetViews/DonationsByBracket',
    'views/widgetViews/DailyBreakdowns',
    'views/date',
    'text!views/templates/library.html'
], function( $, _, Backbone, DonationsByBracket, DailyBreakdowns, DateTime, libraryTemplate ){

    var Library = Backbone.View.extend({

        initialize: function(){

            this.template = _.template( libraryTemplate );
            this.dailyBreakdowns = new DailyBreakdowns({el: '#widgetSection'});
            this.donationsByBracket = new DonationsByBracket({el: '#widgetSection'});
            this.date = new DateTime();

        },

        render: function(){

            //TODO: attach all widgets for this view
            $(this.el).append(this.template);
            this.dailyBreakdowns.render();
            this.donationsByBracket.render();
            //TODO: render this widget when it is more interesting :)
                //this.date.render();

        }

    });

    return Library;
});