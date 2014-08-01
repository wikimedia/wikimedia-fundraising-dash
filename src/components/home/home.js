define(
    ['knockout',
     'text!./home.html'
    ], function( ko, homeTemplate ) {

    function HomeViewModel( route ) {
        var self = this;
        self.action = (route && route.action) || 'view';

        self.dashboardTitle = ko.observable('Dashboard:test');
        self.dashboardUrl   = ko.computed(function(){
            return 'http://meta.wikimedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=' + self.dashboardTitle();
        }, self);
    }

    return { viewModel: HomeViewModel, template: homeTemplate };

});