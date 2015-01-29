define( [
    'knockout',
    'text!components/nav-bar/nav-bar.html'
], function( ko, template ){


    function NavBarViewModel( params ){
    	var self = this;
        self.loggedIn = params.loggedIn;
        self.welcome = params.welcome;
        self.userBoards = params.userBoards;

        self.hideNav = function(){
        	//make the nav menu fold out of view.
            $('#navContainer .navWrapper').toggleClass('hide');
            $('#showNavMenu').css('display', 'inline');
            $('#dashApp').css('padding', '0 0 0 10px');
        };

        self.showNav = function(){
        	window.setTimeout(function(){
                $('#navContainer .navWrapper').toggleClass('hide');
                $('#dashApp').css('padding-left', '175px');
            }, 200);
        };

        $('.mainNavButton').click(function(e){
            $('.mainNavButton').removeClass('selectedSubNav');
            if($(e.target).hasClass('mainNavButton')){
                $(e.target).addClass('selectedSubNav');
            } else {
                $(e.target.parentElement).addClass('selectedSubNav');
            }
        });

        self.toggleBoardList = function(){
            $('#boards.subNavBoardOpts').slideDown(200, 'swing', function(){
                $('#boards.subNavBoardOpts').toggleClass('hide');
            });
        };

        self.toggleProfileList = function(){
            $('#profileLinks.subNavBoardOpts').slideDown(200, 'swing', function(){
                $('#profileLinks.subNavBoardOpts').toggleClass('hide');
            });
        };

    }

    return { viewModel: NavBarViewModel, template: template };

});