"use strict";
define(
    ['base'],
    function(base) {
        var run = function() {
            test('base should return the sum of the two supplied numbers.', function() {
                equal(base(1,1), 2, 'The return should be 2.');
                equal(base(-2,1), -1, 'The return should be -1.');
            });
        };
        return {run: run}
    }
);