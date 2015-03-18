define(
    [   'jquery',
        'knockout',
        'text!./app-content.html'
    ], function( $, ko, templateMarkup ) {

    function AppContent( params ) {
        var self = this;

        self.url                = params.url || 'hi';
        self.displayedBoard     = ko.observable();
        self.userBoards         = ko.observableArray();
        self.userdata           = ko.observableArray();
        self.displayPage        = ko.observable('Home');
        self.loggedIn           = ko.observable(false);
        self.welcome            = ko.observable('');
        self.widgetTemplates    = ko.observableArray();
        self.widgetInstances    = ko.observableArray();

        $.get( '/user/info', function( userInfo ) {
            if ( userInfo ) {
                self.userdata( userInfo );
                self.welcome( userInfo.name.charAt(0).toUpperCase() + userInfo.name.slice(1) );
                self.loggedIn( true );

                $.get( 'board/' + self.userdata().defaultBoard, function( moredata ){
                    self.displayedBoard( moredata );
                });

                $.get( 'board/', function ( boards ){
                    $.each( boards, function( i, board ){
                        if( board.ownerId === self.userdata().id ){
                            self.userBoards.push(board);
                        }
                    });
                });
            }
        });

        self.addWidgetToBoard = function( event, data ){
            var widgetIDToAdd;

            $.ajax({
                method: 'POST',
                url: '/widget-instance',
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify({
                    widgetId: event.id,
                    displayName: 'My ' + event.displayName,
                    isShared: false
                }),
                success: function( data ) {
                    widgetIDToAdd = data.id; var gettingBoard, defaultBoardConfig;

                    if( self.userdata().defaultBoard !== parseInt( self.displayedBoard().id, 10) ){
                        gettingBoard = $.ajax({
                                url: '/board/' + self.userdata().defaultBoard,
                                success: function( stuff ) {
                                    defaultBoardConfig = stuff;
                                }
                            });
                    } else {
                        defaultBoardConfig = self.displayedBoard();
                        gettingBoard = $.Deferred().resolve(defaultBoardConfig).promise();
                    }

                    $.when( gettingBoard ).then( function( returnedData ){
                        defaultBoardConfig = returnedData;
                        defaultBoardConfig.widgets.push(data.id);

                        $.ajax({
                            method: 'PUT',
                            url: '/board/' + self.userdata().defaultBoard,
                            contentType: 'application/json; charset=UTF-8',
                            data: JSON.stringify( defaultBoardConfig ),
                            success: function( stuff ) {
                                //change the look of the add widget button
                                $( '#add-widget-' + event.id ).hide();
                                $( '#saved-widget-' + event.id ).removeClass( 'hide' );
                            }
                        });
                    });


                }
            });

        };

        self.setDisplayPage = function( e, data ){
            var pages = [ 'Library', 'Profile', 'Home' ], view = data.target.id;

            if( pages.indexOf(data.target.id) > -1 ){
                self.displayPage(view);
            } else if( isNaN( parseInt( view, 10 ) ) ) {
                self.displayPage($.trim($(data.target).text()));
            } else {
                $.get( 'board/' + view, function( bdata ){
                    self.displayedBoard( bdata );
                });
            }

        };

        self.getWidgetTemplates = function(){
            $.get( '/widget', function( widgetTemplates ){

                var wt = $.map(widgetTemplates, function(n){
                    return n;
                });

                self.widgetTemplates(wt);
            });
        };
        self.getWidgetTemplates();

        self.getUsersWidgetInstances = function(){
            $.get('/widget-instance', function( widgetInstances ){

                var wi = $.map(widgetInstances, function(n){
                    return n;
                });

                self.widgetInstances(wi);
            });
        };
        self.getUsersWidgetInstances();

    }

    return { viewModel: AppContent, template: templateMarkup };
});
