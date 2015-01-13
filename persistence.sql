/* Should you need to drop first, use these
DROP TABLE dash_widget_instance_board;
DROP TABLE dash_board;
DROP TABLE dash_widget_instance;
DROP TABLE dash_widget;
DROP TABLE dash_user;
*/

CREATE TABLE IF NOT EXISTS dash_user(
	id INT AUTO_INCREMENT PRIMARY KEY, /* local id */
	oauth_id VARCHAR(255), /* remote unique id */
	oauth_provider VARCHAR(255), /* service that gave us the remote id */
	display_name VARCHAR(255), /* display name provided by oauth */
	default_board INT,
	UNIQUE (oauth_id, oauth_provider)
);
/* List of available widgets */
CREATE TABLE IF NOT EXISTS dash_widget(
	id INT AUTO_INCREMENT PRIMARY KEY,
	code VARCHAR(255), /* used in data and metadata URLs */
	display_name VARCHAR(255),
	description TEXT,
	preview_path VARCHAR(255), /* preview image */
	UNIQUE (code) 
);
/* Saved widget configurations */
CREATE TABLE IF NOT EXISTS dash_widget_instance(
	id INT AUTO_INCREMENT PRIMARY KEY,
	widget_id INT,
	owner_id INT,
	display_name VARCHAR(255),
	description TEXT,
	is_shared TINYINT DEFAULT 0,
	configuration TEXT, /* json blob */
	FOREIGN KEY (widget_id) REFERENCES dash_widget(id),
	FOREIGN KEY (owner_id) REFERENCES dash_user(id)
);
/* List of available boards */
CREATE TABLE IF NOT EXISTS dash_board(
	id INT AUTO_INCREMENT PRIMARY KEY,
	display_name VARCHAR(255),
	description TEXT,
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
INSERT IGNORE INTO dash_widget ( code, display_name, description, preview_path ) VALUES ( 'fraud', 'Fraud Gauge', 'Shows the percentage of transactions rejected by fraud filters', 'images/fraud.png' );
INSERT IGNORE INTO dash_widget ( code, display_name, description, preview_path ) VALUES ( 'big-english', 'Big English', 'Shows a set of graphs relating to the big English fundraiser', 'images/big-english.png' );
INSERT IGNORE INTO dash_widget ( code, display_name, description, preview_path ) VALUES ( 'x-by-y', 'X by Y', 'A highly configurable chart allowing grouping by many measures', 'images/x-by-y.png' );

/* Tailor these to your liking
GRANT INSERT, SELECT, UPDATE, DELETE ON dash_widget_instance_board TO 'testuser'@'localhost';
GRANT INSERT, SELECT, UPDATE, DELETE ON dash_board TO 'testuser'@'localhost';
GRANT INSERT, SELECT, UPDATE, DELETE ON dash_widget_instance TO 'testuser'@'localhost';
GRANT INSERT, SELECT, UPDATE, DELETE ON dash_widget TO 'testuser'@'localhost';
GRANT INSERT, SELECT, UPDATE, DELETE ON dash_user TO 'testuser'@'localhost';
*/