define( [
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!views/templates/mainNav.html',
    'momentjs'
], function( $, _, Backbone, Handlebars, navTemplate, momentjs ){

    var Nav = Backbone.View.extend({

        template: _.template( navTemplate ),

        initialize: function(){
          //if user is logged in, show their avatar/name
            //that code here
          //otherwise, show login button
          this.events = {
            'mouseover .titlebrandToggle': this.toggleViewLink,
            'mouseout .titlebrandToggle': this.toggleViewLink,
            'click #collapseNavMenu': this.collapseNavMenu,
            'click #showNavMenu': this.showNavMenu,
            'click #navDefaultBoard': this.getDefaultBoard,
            'click #navProfileSettings': this.getProfileSettings,
            'click #navFavorites': this.getFavorites,
            'click #navLibrary': this.getLibrary
            };

          this.context = { thisMoment: moment().format('MMMM Do, YYYY')};
          this.template = Handlebars.compile(navTemplate);
          this.html = this.template(this.context);
        },

        render: function(){

            $(this.el).append(this.html);
            return this;

        },

        collapseNavMenu: function(){
            //make the nav menu fold out of view.
            $('#navContainer .navWrapper').toggleClass('hide');
            $('#showNavMenu').css('display', 'inline');
            $('#dashApp').css('padding', '0 0 0 55px');
        },

        showNavMenu: function() {
            window.setTimeout(function(){
                $('#navContainer .navWrapper').toggleClass('hide');
                $('#dashApp').css('padding-left', '175px');
            }, 200);
        },

        getDefaultBoard: function(){
            window.alert("This takes you to your default board.");
        },

        getProfileSettings: function(){
            window.alert("Goes to Profile Settings to change or view settings.");
        },

        getFavorites: function(){
            window.alert("Takes you to see your favorited stuff.");
        },

        getLibrary: function(){
            //tell app view to render library
            //bubble to appContent.js
            window.alert("this link will take you to the library from your current Board view. but it hasn't been built yet so...sorry!");
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