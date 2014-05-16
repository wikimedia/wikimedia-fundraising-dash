define( [
    'jquery',
    'underscore',
    'backbone',
    'text!views/templates/mainNav.html'
], function( $, _, Backbone, navTemplate ){

    var Nav = Backbone.View.extend({

        template: _.template( navTemplate ),

        initialize: function(){
          //if user is logged in, show their avatar/name
            //that code here
          //otherwise, show login button

        },

        events: {
            'click #login': this.login
        },

        render: function(){

            $(this.el).append(this.template);

        },

        login: function(){
            console.log("what");
            alert('you need to login! There is no way to do that yet though, so, sorry.');
        }

    });

    return Nav;
});