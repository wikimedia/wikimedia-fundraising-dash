define( [
    'jquery',
    'underscore',
    'backbone',
    //TODO: make the retrieval of these widgets dynamic based on user
    //and board selected. Import collections rather than individual views.
    'views/widgetViews/DonationsByBracket',
    'text!views/templates/library.html'
], function( $, _, Backbone, DonationsByBracket, libraryTemplate ){

    var Library = Backbone.View.extend({

        initialize: function(){

            this.template = _.template( libraryTemplate );
            this.donationsByBracket = new DonationsByBracket({el: '#widgetSection'});

        },

        render: function(){

            //TODO: attach all widgets for this view
            $(this.el).append(this.template);
            this.donationsByBracket.render();

        }

    });

    return Library;
});