define(
    [   'jquery',
        'knockout',
        'crossroads',
        'hasher'
    ], function( $, ko, crossroads, hasher ) {

    var routerConfig = {
        defaultParams: { page: 'home', action: 'view' }
    };

    function Router( config ) {
        var self = this;
        var currentRoute = self.currentRoute = ko.observable({});

        crossroads.addRoute( ':page:/:action:', function( requestParams ) {
            var routeParams = $.extend( config.defaultParams, requestParams );
            self.currentRoute = routeParams;
        });
        crossroads.bypassed.add( function(){
            self.error(404);
        });
        self.error = function( code ){
            self.currentRoute({ page: 'error', code: code });
        };

        startCrossroads();

    }

    function startCrossroads() {
        function parseHash( newHash, oldHash ) { crossroads.parse( newHash ); }

        crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;

        hasher.initialized.add( parseHash );
        hasher.changed.add( parseHash );
        hasher.init();
    }

    return new Router( routerConfig );
});