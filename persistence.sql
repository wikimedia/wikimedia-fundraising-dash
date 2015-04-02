/* Should you need to drop first, use these
DROP TABLE dash_widget_instance_board;
DROP TABLE dash_board;
DROP TABLE dash_widget_instance;
DROP TABLE dash_widget;
DROP TABLE dash_user;
*/

CREATE TABLE IF NOT EXISTS dash_user(
	id INT AUTO_INCREMENT PRIMARY KEY, /* local id */
	oauth_id VARCHAR(255) CHARACTER SET utf8, /* remote unique id */
	oauth_provider VARCHAR(255) CHARACTER SET utf8, /* service that gave us the remote id */
	display_name VARCHAR(255) CHARACTER SET utf8, /* display name provided by oauth */
	default_board INT,
	avatar VARCHAR(255) CHARACTER SET utf8, /* avatar image */
	title VARCHAR(255) CHARACTER SET utf8,
	email VARCHAR(255) CHARACTER SET utf8,
	UNIQUE (oauth_id, oauth_provider)
);
/* List of available widgets */
CREATE TABLE IF NOT EXISTS dash_widget(
	id INT AUTO_INCREMENT PRIMARY KEY,
	code VARCHAR(255) CHARACTER SET utf8, /* used in data and metadata URLs */
	display_name VARCHAR(255) CHARACTER SET utf8,
	description TEXT CHARACTER SET utf8,
	preview_path VARCHAR(255) CHARACTER SET utf8, /* preview image */
	UNIQUE (code)
);
/* Saved widget configurations */
CREATE TABLE IF NOT EXISTS dash_widget_instance(
	id INT AUTO_INCREMENT PRIMARY KEY,
	widget_id INT,
	owner_id INT,
	display_name VARCHAR(255) CHARACTER SET utf8,
	description TEXT CHARACTER SET utf8,
	is_shared TINYINT DEFAULT 0,
	configuration TEXT CHARACTER SET utf8, /* json blob */
	FOREIGN KEY (widget_id) REFERENCES dash_widget(id),
	FOREIGN KEY (owner_id) REFERENCES dash_user(id)
);
/* List of available boards */
CREATE TABLE IF NOT EXISTS dash_board(
	id INT AUTO_INCREMENT PRIMARY KEY,
	display_name VARCHAR(255) CHARACTER SET utf8,
	description TEXT CHARACTER SET utf8,
	owner_id INT NOT NULL,
	is_shared TINYINT DEFAULT 0,
	FOREIGN KEY (owner_id) REFERENCES dash_user(id)
);
/* Places widget instances on boards */
CREATE TABLE IF NOT EXISTS dash_widget_instance_board(
	id INT AUTO_INCREMENT PRIMARY KEY,
	instance_id INT,
	board_id INT,
	widget_position INT,
	FOREIGN KEY (instance_id) REFERENCES dash_widget_instance(id),
	FOREIGN KEY (board_id) REFERENCES dash_board(id)
);

/* Add definitions for existing widgets */
INSERT IGNORE INTO dash_widget ( code, display_name, description, preview_path ) VALUES ( 'fraud-gauge', 'Fraud Gauge', 'Shows the percentage of transactions rejected by fraud filters', 'images/fraud-gauge.png' );
INSERT IGNORE INTO dash_widget ( code, display_name, description, preview_path ) VALUES ( 'x-by-y', 'X by Y', 'A highly configurable chart allowing grouping by many measures', 'images/x-by-y.png' );
INSERT IGNORE INTO dash_widget ( code, display_name, description, preview_path ) VALUES ( 'amt-per-second-chart', 'Amount Per Second', 'Shows USD per second required to reach Big English goal', 'images/amt-per-sec.png');
INSERT IGNORE INTO dash_widget ( code, display_name, description, preview_path ) VALUES ( 'distance-to-goal-chart', 'Distance to Goal', 'Line chart showing USD needed to reach overall Big English goal', 'images/distance-to-goal.png');
INSERT IGNORE INTO dash_widget ( code, display_name, description, preview_path ) VALUES ( 'totals-earned-chart', 'Totals Earned', 'Main Big English bar chart showing daily and hourly donation totals and counts', 'images/totals-earned.png');
INSERT IGNORE INTO dash_widget ( code, display_name, description, preview_path ) VALUES ( 'cat-trombone', 'Trombone Cat', 'A cat is playing a TROMBONE', 'images/catmusician.gif');

/* Tailor these to your liking
GRANT INSERT, SELECT, UPDATE, DELETE ON dash_widget_instance_board TO 'testuser'@'localhost';
GRANT INSERT, SELECT, UPDATE, DELETE ON dash_board TO 'testuser'@'localhost';
GRANT INSERT, SELECT, UPDATE, DELETE ON dash_widget_instance TO 'testuser'@'localhost';
GRANT INSERT, SELECT, UPDATE, DELETE ON dash_widget TO 'testuser'@'localhost';
GRANT INSERT, SELECT, UPDATE, DELETE ON dash_user TO 'testuser'@'localhost';
*/