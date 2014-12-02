define(
    [  'jquery',
       'knockout',
       './router',
       'bootstrap',
       'knockout-projections'
       //'./bindings'
    ], function( $, ko, router ){

        ko.components.register( 'dashboard',                  { require: 'components/dashboard/dashboard' });
        ko.components.register( 'home',                       { require: 'components/home/home' });
        ko.components.register( 'nav-bar',                    { require: 'components/nav-bar/nav-bar' });
        ko.components.register( 'app-content',                { require: 'components/app-content/app-content' });

        //register utils
        ko.components.register( 'date-pickers',               { require: 'components/utils/date-pickers/date-pickers' });

        //register boards
        ko.components.register( 'bigEnglishBoard',            { require: 'components/boards/bigEnglish/bigEnglishBoard' });

        //register individual widgets
        ko.components.register( 'fraud-gauge',                { require: 'components/widgets/fraud-gauge/fraud-gauge' });
        ko.components.register( 'totals-earned-chart',        { require: 'components/widgets/totals-earned-chart/totals-earned-chart' });
        ko.components.register( 'distance-to-goal-chart',     { require: 'components/widgets/distance-to-goal-chart/distance-to-goal-chart' });
        ko.components.register( 'amt-per-second-chart',       { require: 'components/widgets/amt-per-second-chart/amt-per-second-chart' });

        //fire up router
        ko.applyBindings({ route: router.currentRoute });



});