insert ignore into dash_widget (code, display_name, description, preview_path)
	values ('ab-testing', 'A/B Testing', 'Banner A/B test widget', 'images/abtesting.svg');

set @wid = (select id from dash_widget where code = 'ab-testing');

insert ignore into dash_user (id, display_name)
	value (1, 'Dev User');

set @board_count = ( select count(*) FROM dash_board WHERE display_name='A/B Testing' AND owner_id = 1 );

insert ignore into dash_board (display_name, description, owner_id, is_shared)
	SELECT 'A/B Testing', 'Banner A/B test results', 1, 1
	FROM dash_user u
	WHERE id = 1 AND @board_count = 0;

set @bid = (select id from dash_board where owner_id = 1 AND display_name = 'A/B Testing');

insert ignore into dash_widget_instance (widget_id, owner_id, display_name, is_shared)
	select @wid, 1, display_name, 1 from dash_widget where id = @wid;

set @iid = (select id from dash_widget_instance where widget_id = @wid);

insert ignore into dash_widget_instance_board (instance_id, board_id, widget_position)
	values (@iid, @bid, 1);
