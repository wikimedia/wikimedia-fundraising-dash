define( [
 'jquery',
 'underscore',
 'backbone',
 'routers/routes',
 'text!templates/main.html'
], function( $, _, Backbone, router, mainTemplate ){

 var App = Backbone.View.extend({

     el: 'body',

     template: _.template(mainTemplate),

     render: function(){
         this.el.append(this.template);
     }

 });

  return App;

});