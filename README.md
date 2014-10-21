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
+ A local database that reflects fredge (not provided here since there is sensitive data involved)

To use the live version with actual Fundraising data, you will need special permissions. Please contact ssmith@wikimedia.org.

Framework / Libraries
=====================

Dash is a [NodeJS](http://nodejs.org/)/[Express](http://expressjs.com/) app.
The front end uses [RequireJS](http://requirejs.org/) for optimal module loading, with [Knockout](http://knockoutjs.com/) for MVC.

For now, Boostrap provides the main grid structure and basic styling. This is so that collaboration is easier, but may be replaced with something better and/or custom in the future.

Various charting and mapping libraries, such as d3, ChartJS, and flot, are being used with Dash. *Update:* This is being replaced by components provided by the Wikimedia Foundation's Analytics project [Dashiki](https://github.com/wikimedia/analytics-dashiki), which can be viewed on [metrics.wmflabs.org](https://metrics.wmflabs.org/static/public/dash/).

All front-end Javascript is managed and maintained with [Bower](http://bower.io/). To upgrade any front-end library (listed below), simply run `bower update`. Separate repos containing these libraries are submoduled in [dash-node-modules](https://github.com/sherah/dash_node_modules) and [dash-bower-modules](https://github.com/sherah/dash_bower_modules).

###All libraries Dash relies upon:

####Backend

+ chalk
+ commander
+ deeply
+ event-stream
+ express
+ gulp
+ lodash
+ mysql
+ odata-parser
+ passport
+ rconsole

####Front end

+ autotype
+ bootstrap
+ bootstrap-datepicker
+ bootstrap-timepicker
+ chartjs
+ crossroads
+ d3
+ fontawesome
+ gauge.js
+ hasher
+ jquery
+ js-signals
+ knockout
+ lato
+ moment
+ nouislider
+ requirejs

App Structure
=============

Dash is organized as follows:

+ src/app/ directory contains knockout bindings.js file for common functions (coming soon), require config file, front end router, and startup file
+ src/components/ directory contains all views organized into their own directory, with corresponding html templates
+ routes/ directory provides querying/data for front end consumption

## Phase 1 (the current state of things!):
There is one main view: the widget Library view. (This is because there are < a lot of widgets in existence at the moment.)

There is also a "secret" admin view, for admins. But this hasn't been built out yet.

The Library view contains the subviews of all available widgets. Each subview manages its own data and events.

Next Steps
==========

+ "Build new board," Default Board, All Boards views introduced.
+ My Boards, general sharing with Tags and Favorites introduced.
+ Eternal bliss and happiness


