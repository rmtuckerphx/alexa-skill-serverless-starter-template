'use strict';

const ListUtility = require('../../src/listUtility');
const expect = require( 'chai' ).expect;
const assert = require( 'chai' ).assert;

describe('listUtility', function () {

    it('returns first index array when visitedIndexes is empty', function () {
        let params = {
            sourceListSize: 2,
            visitedIndexes: []
        };

        let listUtility = new ListUtility(params);
        let result = listUtility.getFirstIndex();

        assert.equal(1, result.index);
    });
});
