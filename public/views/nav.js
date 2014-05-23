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
          this.events = {
            'mouseover .titlebrandToggle': this.toggleViewLink,
            'mouseout .titlebrandToggle': this.toggleViewLink,
            'click #loginNavBtn': this.login,
            'click #libraryNavBtn': this.getLibrary
            };
        },

        render: function(){

            $(this.el).append(this.template);
            return this;

        },

        login: function(){

            window.alert('you need to login! There is no way to do that yet though, so, sorry.');
        },

        getLibrary: function(){
            //tell app view to render library
            //bubble to appContent.js
        },

        toggleViewLink: function() {
            if($('.titleBrandToggle').text()==='Board'){
                $('.titleBrandToggle').text('Library');
            } else {
                $('.titleBrandToggle').text('Board');
            }
        }

    });

    return Nav;
});