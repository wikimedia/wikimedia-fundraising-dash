define( [
    'jquery',
    'underscore',
    'backbone',
    'views/nav',
    'views/adminContent'
], function( $, _, Backbone, navView, AdminContentView ){

    var Admin = Backbone.View.extend({

        el: '.container-fluid #dashAdmin',

        initialize: function(){

            this.nav = new navView({el: '#navContainer'});
            this.adminView = new AdminContentView({el: '.row-fluid #adminContent'});

        },

        render: function(){

            this.nav.render();
            this.adminView.render();

        }

    });

    return Admin;
});