insert into dash_widget (code, display_name, description, preview_path)
	values ('ab-testing', 'A/B Testing', 'Banner A/B test widget', 'images/abtesting.svg');

set @wid = LAST_INSERT_ID();

insert into dash_board (display_name, description, owner_id, is_shared)
	values ('A/B Testing', 'Banner A/B test results', 1, true);

set @bid = LAST_INSERT_ID();

update dash_user set default_board = @bid where id = 1;

insert into dash_widget_instance (widget_id, owner_id, display_name, is_shared)
	select @wid, 1, display_name, 1 from dash_widget where id = @wid;

set @iid = LAST_INSERT_ID();

insert into dash_widget_instance_board (instance_id, board_id, widget_position)
	values (@iid, @bid, 1);
