-- Add donation age widget to all existing Big English boards
INSERT INTO dash_widget_instance(widget_id, owner_id, display_name, description)
SELECT w.id, b.owner_id, w.display_name, w.description
FROM dash_widget w
INNER JOIN dash_board b
LEFT JOIN dash_widget_instance wi ON wi.widget_id = w.id AND b.owner_id = wi.owner_id
WHERE w.code='donation-age'
AND b.display_name = 'Big English'
AND wi.id IS NULL;

INSERT INTO dash_widget_instance_board (instance_id, board_id, widget_position)
SELECT instance_id, next_pos.board_id, next_pos.pos
FROM 
(
	SELECT MAX(widget_position) + 1 AS pos, board_id
	FROM dash_widget_instance_board
	GROUP BY board_id
) AS next_pos,
(
	SELECT wi.id as instance_id, b.id AS board_id
	FROM dash_widget w
	INNER JOIN dash_widget_instance wi ON w.id = wi.widget_id
	INNER JOIN dash_board b ON wi.owner_id = b.owner_id
	LEFT JOIN dash_widget_instance_board wib ON wi.id = wib.instance_id AND b.id = wib.board_id
	WHERE w.code='donation-age'
	AND b.display_name = 'Big English'
	AND wib.id IS NULL
) AS ids
WHERE ids.board_id = next_pos.board_id;
