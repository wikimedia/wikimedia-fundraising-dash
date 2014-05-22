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
          console.log('nav events: ', this.events);
        },

        events: {
            'hover .titleBrandToggle': this.toggleViewLink,
            'click #login': this.login
        },

        render: function(){

            $(this.el).append(this.template);

        },

        login: function(){
            console.log("what");
            alert('you need to login! There is no way to do that yet though, so, sorry.');
        },

        toggleViewLink: function() {
            console.log('hover');
            $('.titleBrandToggle').text('Library');
        }

    });

    return Nav;
});