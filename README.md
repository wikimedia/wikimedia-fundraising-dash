Welcome to the internal Dashboard app for Fundraising!
It's cool. [Here's the demo slide deck](http://slides.com/sherahsmith/dash) - but this readme is more complete.

Dash App Goals
==============

+ Provide a private library of reports, charts, and other visualizations to move fundraising into easier, centralized data monitoring and analysis
+ Move fundraising away from sifting through piles of spreadsheets, squinting at log files and laborious copy/paste exercises that suck up time
+ Make real-time monitoring an automatically-updated, trustworthy part of fundraising staff workflow
+ Handle all types of incoming data formats by transforming and depositing it all into one metrics database
+ Allow fr-tech and fr-nontech alike to see what is happening throughout the department by perusing one another's Boards (shared collections of widgets)

Prerequisites
=============

To play with Dash, you will need:

+ Node v. 0.8 (I recommend using [nvm](https://github.com/creationix/nvm) to manage node versions if you already have another version on your machine.)
+ [npm](https://www.npmjs.org/) to manage backend packages and because you need Bower.
+ [Bower](http://bower.io/), a package manager specifically optimized for front-end packages.

To use the live version with actual Fundraising data, you will need special permissions. Please contact ssmith@wikimedia.org.

Framework / Libraries
=====================

Dash is a [NodeJS](http://nodejs.org/)/[Express](http://expressjs.com/) app.
The front end uses [RequireJS](http://requirejs.org/) for optimal module loading, with [BackboneJS](http://backbonejs.org/) for MVC. The front-end templating is handled by Handlebars.
For now, Boostrap provides the main grid structure and basic styling. This is so that collaboration is easier, but may be replaced with something better and/or custom in the future.

Various charting and mapping libraries, such as d3, ChartJS, and flot, are being used with Dash. More will be added as needs grow. Dash is happy to include all the cool kids on the block.

All front-end Javascript is managed and maintained with [Bower](http://bower.io/). In this project, Bower installs all such packages into the public/javascripts/vendor directory. To upgrade any front-end library (listed below), simply run `bower update`.

###All libraries Dash relies upon:

####Backend

+ Express
+ Jade
+ Commander
+ rConsole

####Front end

+ Backbone
+ Bootstrap
+ ChartJS
+ D3
+ Flot
+ Handlebars
+ jQuery
+ jQueryUI
+ MomentJS
+ qUnit
+ RequireJS
+ Underscore

App Structure
=============

Dash is organized as follows:

+ collections: this is where database tables will be reflected/held
+ css: main css folder
+ javascripts:
  + tests: main test javascripts for qUnit
  + vendor: all vendor javascripts, managed with Bower
  + test files (right now to test testing; these will go away once real tests start happening)
+ models: boilerplate models folder
+ routers: boilerplate routers folder
+ utils: app-wide utility functions that can be used by multiple views
+ views: there are two types of viewing-type files; "templates" and "views".
  + templates: the actual html that views are rendered as.
    + widgets: widget-specific html file bucket.
    + everything else here is either a jade template (used by express/node from the backend), or an html file/partial.
  + widgetViews: each individual widget in the Dash is represented here as a widget View object file.
  + everything else here is a Javascript file containing non-widget-related View objects.
+ admin.js: configuration and instantiation of admin area (under development).
+ main.js: configuration and instantiation of app container.
+ defaults.js: server defaults.
+ package.json: specifies which server packages npm needs to manage for the project.
+ server.js: boot file.

## Phase 1 (the current state of things!):
There is one main view: the widget Library view. (This is because there are < a lot of widgets in existence at the moment.)

There is also a "secret" admin view, for admins. But this hasn't been built out yet.

The Library view contains the subviews of all available widgets. Each subview manages its own data and events.

Next Steps
==========

+ "Build new board," Default Board, All Boards views introduced.
+ My Boards, general sharing with Tags and Favorites introduced.
+ Eternal bliss and happiness

Testing
=======

Dash is set up to use qUnit for testing. More info when tests are actually written and running.

Prototypes
==========

You can see the app prototypes as well as individual widget prototypes in `public/collections/prototypes`.

