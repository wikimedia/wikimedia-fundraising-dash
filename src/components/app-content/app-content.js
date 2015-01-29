define(
    [   'jquery',
        'knockout',
        'text!./app-content.html'
    ], function( $, ko, templateMarkup) {

    function AppContent(params) {
        var self = this;

        self.url = params.url || 'hi';
        self.userDefaultBoard = ko.observable();
        self.userBoards = ko.observableArray();
        self.userdata = ko.observableArray();

        self.loggedIn = ko.observable(false);
        self.welcome = ko.observable('');

        //Get user info and configs like default board
        $.get('/user/info', function(userInfo) {
            if (userInfo) {
                self.userdata( userInfo );
                self.welcome( userInfo.name.charAt(0).toUpperCase() + userInfo.name.slice(1) );
                self.loggedIn( true );

                $.get('board/' + self.userdata().defaultBoard, function( moredata ){
                    self.userDefaultBoard( moredata );
                });
            }
        });

    }

    return { viewModel: AppContent, template: templateMarkup };
});
