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

+ NodeJS v. 0.8.2 (I recommend using [nvm](https://github.com/creationix/nvm) to manage node versions if you already have another version on your machine.)
+ [npm](https://www.npmjs.org/) to manage backend packages and because you need Bower.
+ [Bower](http://bower.io/), a package manager specifically optimized for front-end packages.
+ A local database that reflects fredge (not provided here since there is sensitive data involved)

To use the live version with actual Fundraising data, you will need special permissions. Please contact ssmith@wikimedia.org.

Installation
============

To install and run the application in development mode, first ensure you do
not have anything already listening to port 8080.  If so, stop it or change
the configured port in defaults.js, or in a new config file, using -c.

```
+ git submodule update -i
+ nvm use 0.8.2
+ cat schema/*.sql | mysql fredge
+ node server.js -d
```

To test OAuth, omit the "-d" option when starting the server.

Test Data
=========

Start with a working install of [WMF's CiviCRM setup](https://phabricator.wikimedia.org/diffusion/WFCG/).  That should include the contribution_tracking table in the drupal database and tables civicrm_contribution and wmf_contribution_extra in the civicrm database.

Then run the scripts in this app's schema/ folder to create a fredge database (skip 0000 if you already have a fredge db) and add the tables needed for dash.

First populate the contribution_tracking and exchange_rates tables.  Run the test_data scripts contribution_tracking.sql and exchange_rates.sql against the drupal database.  If you need more, generate SQL insert statements from this schema: https://mockaroo.com/e17c4fd0 .

Next, populate the CiviCRM donation and contact tables.  In your CiviCRM install's drupal directory, run drush dpm <dash dir>/test_data/DonationQueueMessages.json.  If you need more, generate them from this schema: https://mockaroo.com/787ef4e0.

If you are generating multiple sets of fake donations, be sure to increment the starting contribution tracking IDs so that they match and do not overlap existing donations.

Then populate fredge's payments_initial table using the script in test_data/payments_initial.sql.

TODO: add payments-fraud rows to match...

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

Deployment
==========

WMF deployment involves a minification step, and requires NodeJS 0.10 (note this is more recent than the production execution requirement, 0.8.2).

+ nvm use 0.10
+ npm install -g gulp
+ gulp
+ git add dist

Don't worry about the lint errors :(

Commit the dist/ output to the deployment branch and push for review.

If you don't have that ancient version of node available and you just need to minify javascript and html templates, you can run the requirejs optimiser directly.

```
node node_modules/requirejs/bin/r.js -o app.build.js
```
Then copy the resulting scripts.js over the existing js file in the dist folder.
