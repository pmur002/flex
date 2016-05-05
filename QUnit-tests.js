QUnit.test( "transLocToNative() tests", function( assert ) {
    function test(x, scale, flip, dim, model) {
        var result = transLocToNative(x, scale, flip, dim);
        assert.deepEqual(result, model);
    }
    // Already native
    test(10, [-1, 1], false, 10, 10);
    // Px
    test("10px", [-1, 1], false, 10, 1);
    // %
    test("50%", [-1, 1], false, 10, 0);
})
QUnit.test( "transDimToPx() tests", function( assert ) {
    function test(x, scale, flip, dim, model) {
        var result = transDimToPx(x, scale, flip, dim);
        assert.deepEqual(result, model);
    }
    test(0, [-1, 1], false, 10, 0);
    test(1, [-1, 1], false, 10, 5);
    test(2, [-1, 1], false, 10, 10);
    test(0, [-1, 1], true, 10, 0);
    test(1, [-1, 1], true, 10, 5);
    test(2, [-1, 1], true, 10, 10);
})
QUnit.test( "transLocToPx() tests", function( assert ) {
    function test(x, scale, flip, dim, model) {
        var result = transLocToPx(x, scale, flip, dim);
        assert.deepEqual(result, model);
    }
    test(0, [-1, 1], false, 20, 10);
    test(1, [-1, 1], false, 20, 20);
    test(-1, [-1, 1], false, 20, 0);
    test(2, [-1, 1], false, 20, 30);
    test(-2, [-1, 1], false, 20, -10);
    test(0, [-1, 1], true, 20, 10);
    test(1, [-1, 1], true, 20, 0);
    test(-1, [-1, 1], true, 20, 20);
    test(2, [-1, 1], true, 20, -10);
    test(-2, [-1, 1], true, 20, 30);
})
QUnit.test( "transToNativeZeroExtentDim() tests", function( assert ) {
    function test(x, scale, flip, model) {
        var result = transToNativeZeroExtentDim(x, scale, flip);
        assert.deepEqual(result, model);
    }
    test(0, [0, 1], false, .5);
    test(5, [0, 1], false, 1);
    test(-5, [0, 1], false, 0);
    test(0, [0, 1], true, .5);
    test(5, [0, 1], true, 0);
    test(-5, [0, 1], true, 1);
})
QUnit.test( "transToPxZeroExtentScale() tests", function( assert ) {
    function test(x, scale, flip, dim, model) {
        var result = transToPxZeroExtentScale(x, scale, flip, dim);
        assert.deepEqual(result, model);
    }
    test(0, [0, 0], false, 10, 5);
    test(-5, [0, 0], false, 10, 0);
    test(5, [0, 0], false, 10, 10);
    test(0, [0, 0], true, 10, 5);
    test(-5, [0, 0], true, 10, 10);
    test(5, [0, 0], true, 10, 0);
})
QUnit.test( "newInnerScale() tests", function( assert ) {
    function test(margins, dim, scale, flip, model) {
        var result = newInnerScale(margins, dim, scale, flip);
        assert.deepEqual(result, model);
    }
    // Zero-extent scales
    test([0, 0], 10, [0, 0], false, [0, 0]);
    test([5, 5], 10, [0, 0], false, [0, 0]);
    // Zero margins
    test([0, 0], 10, [0, 1], false, [0, 1]);
    // Left margin
    test([5, 0], 10, [0, 1], false, [.5, 1]);
    // Right margin
    test([0, 5], 10, [0, 1], false, [0, .5]);    
    // Ditto right-to-left scales
    test([0, 0], 10, [0, 1], true, [0, 1]);
    test([5, 0], 10, [0, 1], true, [0, .5]);
    test([0, 5], 10, [0, 1], true, [.5, 1]);

    // TODO: Zero-width
})
QUnit.test( "newOuterScale() tests", function( assert ) {
    function test(margins, dim, scale, flip, model) {
        var result = newOuterScale(margins, dim, scale, flip);
        assert.deepEqual(result, model);
    }
    // Zero-extent scales
    test([0, 0], 10, [0, 0], false, [0, 0]);
    test([5, 5], 10, [0, 0], false, [0, 0]);
    // Zero margins
    test([0, 0], 10, [0, 1], false, [0, 1]);
    // Left margin
    test([5, 0], 10, [0, 1], false, [-.5, 1]);
    // Right margin
    test([0, 5], 10, [0, 1], false, [0, 1.5]);    
    // Ditto right-to-left scales
    test([0, 0], 10, [0, 1], true, [0, 1]);
    test([5, 0], 10, [0, 1], true, [0, 1.5]);
    test([0, 5], 10, [0, 1], true, [-.5, 1]);

    // TODO: Zero-width
})
QUnit.test( "newTBmargins() tests", function( assert ) {
    function test(tb, bbox, model) {
        // Perform rounding to avoid floating-point differences
        // (this assumes that I am setting up my tests to give integer results)
        var result = newTBmargins(tb, bbox);
        assert.deepEqual([ Math.round(result[0]), Math.round(result[1]) ], 
                         model);
    }
    // Zero margins
    test([0, 10], { y: 0, height: 10 }, [0, 0]);
    // Left margin
    test([0, 10], { y: -5, height: 15 }, [5, 0]);
    // Right margin
    test([0, 10], { y: 0, height: 15 }, [0, 5]);
    // Both
    test([0, 10], { y: -5, height: 20 }, [5, 5]);
})
QUnit.test( "newLRmargins() tests", function( assert ) {
    function test(lr, bbox, model) {
        // Perform rounding to avoid floating-point differences
        // (this assumes that I am setting up my tests to give integer results)
        var result = newLRmargins(lr, bbox);
        assert.deepEqual([ Math.round(result[0]), Math.round(result[1]) ], 
                         model);
    }
    // Zero margins
    test([0, 10], { x: 0, width: 10 }, [0, 0]);
    // Left margin
    test([0, 10], { x: -5, width: 15 }, [5, 0]);
    // Right margin
    test([0, 10], { x: 0, width: 15 }, [0, 5]);
    // Both
    test([0, 10], { x: -5, width: 20 }, [5, 5]);
})
QUnit.test( "newPixels() tests", function( assert ) {
    function test(scale, flip, range, width, model) {
        // Perform rounding to avoid floating-point differences
        // (this assumes that I am setting up my tests to give integer results)
        var result = newPixels(scale, flip, range, width);
        assert.deepEqual([ Math.round(result[0]), Math.round(result[1]) ], 
                         model);
    }
    // New range identical to old scale
    test([0, 1], false, [0, 1], 10, [0, 10]);
    // New range within old scale
    test([0, 1], false, [0.1, .9], 10, [1, 9]);
    // New range outside old scale
    test([0, 1], false, [-.5, 1.5], 10, [-5, 15]);
    // New range overlaps old scale
    test([0, 1], false, [.5, 1.5], 10, [5, 15]);   
    // Zero-extent scale 
    test([0, 0], false, [0, 0], 10, [5, 5]);
    test([0, 0], false, [0, 1], 10, [5, 10]);
    test([0, 0], false, [-1, 1], 10, [0, 10]);
    test([0, 0], false, [1, 1], 10, [10, 10]);
    test([0, 0], false, [-1, -1], 10, [0, 0]);
    // Ditto for right-to-left scale
    test([0, 1], true, [0, 1], 10, [0, 10]);
    test([0, 1], true, [0.1, .9], 10, [1, 9]);
    test([0, 1], true, [-.5, 1.5], 10, [-5, 15]);
    test([0, 1], true, [.5, 1.5], 10, [-5, 5]);    
    test([0, 0], true, [0, 0], 10, [5, 5]);
    test([0, 0], true, [0, 1], 10, [0, 5]);
    test([0, 0], true, [-1, 1], 10, [0, 10]);
    test([0, 0], true, [1, 1], 10, [0, 0]);
    test([0, 0], true, [-1, -1], 10, [10, 10]);
})
QUnit.test( "newScale() tests", function( assert ) {
    function test(scale, range, result) {
        // Require deepEqual() for arrays
        assert.deepEqual(newScale(scale, range), result);
    }
    // Identical scale and range produces identical result
    test([0, 1], [0, 1], [0, 1]);
    // Extend right end of scale
    test([0, 1], [0, 1.5], [0, 1.5]);
    // Extend left end of scale
    test([0, 1], [-1, 1], [-1, 1]);
    // Extend both ends of scale
    test([0, 1], [0.5, 1.5], [0.5, 1.5]);
    test([0, 1], [-1, .5], [-1, .5]);
    // New range zero-extent
    test([0, 1], [.5, .5], [.5, .5]);
    // Old scale zero-extent
    test([0, 0], [.5, 1.5], [.5, 1.5]);
})
