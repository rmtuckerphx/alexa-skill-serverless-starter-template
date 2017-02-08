'use strict';

const ListUtility = require('../../src/listUtility');
const expect = require( 'chai' ).expect;
const assert = require( 'chai' ).assert;

describe('listUtility', function () {

    it('should have default settings', function () {
         let listUtility = new ListUtility();

         assert.equal(0, listUtility.settings.sourceListSize);
         assert.equal(0, listUtility.settings.visitedIndexes.length);

    });

    it('should use options for settings when passed', function () {
        let options = {
            sourceListSize: 3,
            visitedIndexes: [1,2]
        };

         let listUtility = new ListUtility(options);

         assert.equal(3, listUtility.settings.sourceListSize);
         assert.equal(2, listUtility.settings.visitedIndexes.length);

    });

    it('should return first index array when visitedIndexes is empty', function () {
        let myIndexes = [];

        let options = {
            sourceListSize: 2,
            visitedIndexes: myIndexes
        };

        let listUtility = new ListUtility(options);
        let result = listUtility.getFirstIndex();

        assert.equal(0, result.index);
        assert.equal(1, result.newVisitedIndexes.length);
        assert.deepEqual([0], result.newVisitedIndexes);
        assert.deepEqual([], myIndexes);

    });

    it('should return first index each call to getFirstIndex', function () {
        let myIndexes = [];

        let options = {
            sourceListSize: 4,
            visitedIndexes: myIndexes
        };

        let listUtility = new ListUtility(options);
        let result = listUtility.getFirstIndex();
        assert.equal(0, result.index);
        assert.equal(1, result.newVisitedIndexes.length);
        assert.deepEqual([0], result.newVisitedIndexes);
        assert.deepEqual([], myIndexes);

        result = listUtility.getFirstIndex();
        assert.equal(1, result.index);
        assert.equal(2, result.newVisitedIndexes.length);
        assert.deepEqual([0,1], result.newVisitedIndexes);
        assert.deepEqual([], myIndexes);
        
        result = listUtility.getFirstIndex();
        assert.equal(2, result.index);
        assert.equal(3, result.newVisitedIndexes.length);
        assert.deepEqual([0,1,2], result.newVisitedIndexes);
        assert.deepEqual([], myIndexes);

        result = listUtility.getFirstIndex();
        assert.equal(3, result.index);
        assert.equal(4, result.newVisitedIndexes.length);
        assert.deepEqual([0,1,2,3], result.newVisitedIndexes);
        assert.deepEqual([], myIndexes);

    });

    it('should return next first index on call to getFirstIndex with ordered visitedIndexes', function () {
        let myIndexes = [0,1];

        let options = {
            sourceListSize: 4,
            visitedIndexes: myIndexes
        };

        let listUtility = new ListUtility(options);
        let result = listUtility.getFirstIndex();
        assert.equal(2, result.index);
        assert.equal(3, result.newVisitedIndexes.length);
        assert.deepEqual([0,1,2], result.newVisitedIndexes);
        assert.deepEqual([0,1], myIndexes);
    });

    it('should return next first index on call to getFirstIndex with unordered visitedIndexes', function () {
        let myIndexes = [3,0,2];

        let options = {
            sourceListSize: 4,
            visitedIndexes: myIndexes
        };

        let listUtility = new ListUtility(options);
        let result = listUtility.getFirstIndex();
        assert.equal(1, result.index);
        assert.equal(4, result.newVisitedIndexes.length);
        assert.deepEqual([3,0,2,1], result.newVisitedIndexes);
        assert.deepEqual([3,0,2], myIndexes);
    });

    it('should reset visitedIndexes when full and calling getLastIndex', function () {
        let myIndexes = [0,1,2,3];

        let options = {
            sourceListSize: 4,
            visitedIndexes: myIndexes
        };

        let listUtility = new ListUtility(options);
        let result = listUtility.getFirstIndex();
        assert.equal(0, result.index);
        assert.equal(1, result.newVisitedIndexes.length);
        assert.deepEqual([0], result.newVisitedIndexes);
        assert.deepEqual([0,1,2,3], myIndexes);
        assert.equal(false, result.isVisitedFull)
    });

    it('should not reset visitedIndexes when full and calling getLastIndex', function () {
        let myIndexes = [0,1,2,3];

        let options = {
            sourceListSize: 4,
            visitedIndexes: myIndexes,
            resetWhenFull: false
        };

        let listUtility = new ListUtility(options);
        let result = listUtility.getFirstIndex();
        assert.equal(-1, result.index);
        assert.equal(4, result.newVisitedIndexes.length);
        assert.deepEqual([0,1,2,3], result.newVisitedIndexes);
        assert.deepEqual([0,1,2,3], myIndexes);
        assert.equal(true, result.isVisitedFull)
    });

    it('should return error when source list size is zero and calling getFirstIndex')
    it('should return error when source list size is zero and calling getLastIndex')
    it('should return error when source list size is zero and calling getRandomIndex')



});
