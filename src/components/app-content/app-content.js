define(
    [   'jquery',
        'knockout',
        'text!./app-content.html'
    ], function( $, ko, templateMarkup) {

    function AppContent(params) {
        var self = this;

        self.url = params.url || 'hi';
        self.name = ko.observable();
        self.content = ko.observable('this is the content');
        self.description = ko.observable();
        self.graphs = ko.observableArray([]);

        //set this based on user settings.
        self.userDefaultBoard = ko.observable('bigEnglishBoard');

        //for now make this dummy - it should come from params/global user settings
        self.userBoards = ko.observableArray([
            { name: 'Big English', component: 'bigEnglishBoard' },
            { name: 'A/B Testing', component: 'bigEnglishBoard' },
            { name: 'Fraud Monitoring', component: 'bigEnglishBoard' },
            { name: 'Times Honey is Cute', component: 'bigEnglishBoard' }
        ]);

        self.loggedIn = ko.observable(false);
        self.welcome = ko.observable('');
        $.get('/user/info', function(userInfo) {
            if (userInfo) {
                self.welcome(userInfo.name.charAt(0).toUpperCase() + userInfo.name.slice(1));
                self.loggedIn(true);
            }
        });
    }

    return { viewModel: AppContent, template: templateMarkup };
});
