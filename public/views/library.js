define( [
    'jquery',
    'underscore',
    'backbone',
    'justGage',
    //TODO: make the retrieval of these widgets dynamic based on user
    //and board selected. Import collections rather than individual views.
    'views/welcome.js',
    'views/date',
    'views/widgetViews/FraudRiskScoreGauge',
    'text!views/templates/library.html'
], function( $, _, Backbone, justGage, welcomeView, DateTime, FraudRiskScoreGauge, libraryTemplate ){

    var Library = Backbone.View.extend({

        initialize: function(){

            this.template = _.template( libraryTemplate );
            //this.welcomeMessage = new welcomeView({el: '#widgetSection'});
            this.fraudRiskScoreGauge = new FraudRiskScoreGauge({el: '#widgetSection'});
            this.date = new DateTime();

        },

        render: function(){

            //TODO: attach all widgets for this view
            $(this.el).append(this.template);
            //this.welcomeMessage.render();
            this.fraudRiskScoreGauge.render();

        }

    });

    return Library;
});