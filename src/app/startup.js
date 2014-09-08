define(
    [  'jquery',
       'knockout',
       './router',
       'bootstrap',
       'knockout-projections',

       //'./bindings'
    ], function( $, ko, router ){

        ko.components.register( 'dashboard',          { require: 'components/dashboard/dashboard' });
        ko.components.register( 'home',               { require: 'components/home/home' });
        ko.components.register( 'nav-bar',            { require: 'components/nav-bar/nav-bar' });
        ko.components.register( 'app-content',        { require: 'components/app-content/app-content' });

        //register utils
        ko.components.register( 'date-pickers',       { require: 'components/utils/date-pickers/date-pickers' });

        //register individual widgets
        ko.components.register( 'fraud-gauge',        { require: 'components/widgets/fraud-gauge/fraud-gauge' });
        ko.components.register( 'ab-table',           { require: 'components/widgets/ab-table/ab-table' });

        //fire up router
        ko.applyBindings({ route: router.currentRoute });



});