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

        var find = function(value){
            return function(e, i){
                return value === e;
            };
        };

        self.loggedIn = ko.observable(false);
        self.welcome = ko.observable('');
        $.get('/user/info', function(userInfo) {
            if (userInfo) {
                self.welcome(userInfo['name'].charAt(0).toUpperCase() + userInfo['name'].slice(1));
                self.loggedIn(true);
            };
        });
    }

    return { viewModel: AppContent, template: templateMarkup };
});
