define([
	'knockout',
	'c3'
], function(ko, c3) {
	function destroyChart(element) {
		var chart = ko.utils.domData.get(element, 'chart');
		if (chart) {
			chart.destroy();
			ko.utils.domData.set(element, 'chart', undefined);
		}
	}
	ko.bindingHandlers.c3 = {
		init: function init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var chart, options = ko.unwrap(valueAccessor());
			if (!options) {
				return;
			}
			options.bindto = element;
			chart = c3.generate(options);
			ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
				destroyChart(element);
			});
			ko.utils.domData.set(element, 'chart', chart);
		},
		update: function update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var chart = ko.utils.domData.get(element, 'chart'),
					options = ko.unwrap(valueAccessor());
			if (!options) {
				// Destroys existing chart if you pass a falsy value
				// TODO: also reset when options outside of data have changed.
				if (chart) {
					destroyChart(element);
				}
				return;
			}
			if (chart) {
				chart.load(options.data);
				return;
			}
			options.bindto = element;
			chart = c3.generate(options);
			ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
				destroyChart(element);
			});
			ko.utils.domData.set(element, 'chart', chart);
		}
	};
	/**
	 * From https://github.com/select2/select2/wiki/Knockout.js-Integration
	 */
	ko.bindingHandlers.select2 = {
		init: function(el, valueAccessor, allBindingsAccessor, viewModel) {
			ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
				$(el).select2('destroy');
			});

			var allBindings = allBindingsAccessor(),
				select2 = ko.utils.unwrapObservable(allBindings.select2);

			$(el).select2(select2);
		},
		update: function(el, valueAccessor, allBindingsAccessor, viewModel) {
			var allBindings = allBindingsAccessor();

			if ('value' in allBindings) {
				if (allBindings.select2.multiple && allBindings.value().constructor !== Array) {
					$(el).select2('val', allBindings.value().split(','));
				}
				else {
					$(el).select2('val', allBindings.value());
				}
			} else if ('selectedOptions' in allBindings) {
				var converted = [];
				var textAccessor = function(value) {
					return value;
				};
				if ('optionsText' in allBindings) {
					textAccessor = function(value) {
						var valueAccessor = function(item) {
							return item;
						};
						if ('optionsValue' in allBindings) {
							valueAccessor = function(item) {
								return item[allBindings.optionsValue];
							};
						}
						var items = $.grep(ko.utils.unwrapObservable(allBindings.options), function(e) {
							return valueAccessor(e) === value;
						});
						if (items.length === 0 || items.length > 1) {
							return 'UNKNOWN';
						}
						return items[0][allBindings.optionsText];
					};
				}
				$.each(allBindings.selectedOptions(), function(key, value) {
					converted.push({id: value, text: textAccessor(value)});
				});
				$(el).select2('data', converted);
			}
		}
	};
	return true;
});
