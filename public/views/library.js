define( [
    'jquery',
    'underscore',
    'backbone',
    'routers/approuter',
    'views/widgetViews/DonationsByBracket',
    'text!views/templates/library.html'
], function( $, _, Backbone, router, DonationsByBracket, libraryTemplate ){

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