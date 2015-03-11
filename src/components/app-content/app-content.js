define(
    [   'jquery',
        'knockout',
        'text!./app-content.html'
    ], function( $, ko, templateMarkup) {

    function AppContent(params) {
        var self = this;

        self.url = params.url || 'hi';
        self.displayedBoard = ko.observable();
        self.userBoards = ko.observableArray();
        self.userdata = ko.observableArray();
        self.displayPage = ko.observable('Home');
        self.loggedIn = ko.observable(false);
        self.welcome = ko.observable('');
        self.widgetTemplates = ko.observableArray();
        self.widgetInstances = ko.observableArray();

        //Get user info and configs like default board
        $.get('/user/info', function(userInfo) {
            if (userInfo) {
                self.userdata( userInfo );
                self.welcome( userInfo.name.charAt(0).toUpperCase() + userInfo.name.slice(1) );
                self.loggedIn( true );

                $.get('board/' + self.userdata().defaultBoard, function( moredata ){
                    self.displayedBoard( moredata );
                });

                $.get('board/', function (boards){
                    $.each(boards, function(i, board){
                        if(board.ownerId === self.userdata().id){
                            self.userBoards.push(board);
                        }
                    });
                });
            }
        });

        self.setDisplayPage = function(e, data){
            var pages = ['Library', 'Profile', 'Home'], view = data.target.id;
            if( pages.indexOf(data.target.id) > -1 ){
                self.displayPage(view);
            } else if( isNaN( parseInt( view, 10 ) ) ) {
                self.displayPage($.trim($(data.target).text()));
            } else {
                $.get('board/' + view, function( bdata ){
                    console.log('get board #', data.target.id);
                    console.log('bdata: ', bdata);
                    self.displayedBoard( bdata );
                });
            }

        };

        self.getWidgetTemplates = function(){
            $.get('/widget', function(widgetTemplates){

                var wt = $.map(widgetTemplates, function(n){
                    return n;
                });

                self.widgetTemplates(wt);
            });
        };
        self.getWidgetTemplates();

        self.getUsersWidgetInstances = function(){
            $.get('/widget-instance', function(widgetInstances){

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
