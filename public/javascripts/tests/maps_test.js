"use strict";
define(
    ['maps'],
    function(maps) {
        var run = function() {
            test('maps should return the sum of the two supplied numbers.', function() {
                equal(maps(1,1), 2, 'The return should be 2.');
                equal(maps(-2,1), -1, 'The return should be -1.');
            });
        };
        return {run: run}
    }
);