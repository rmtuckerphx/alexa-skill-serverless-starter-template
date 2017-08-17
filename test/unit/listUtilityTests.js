'use strict';

const ListUtility = require('../../src/util/listUtility');
const expect = require( 'chai' ).expect;
const assert = require( 'chai' ).assert;

describe('listUtility', function () {

    describe('constructor', function () {
        it('should have default settings', function () {

            let options = {
                sourceListSize: 1
            };

            let listUtility = new ListUtility(options);

            assert.equal(1, listUtility.settings.sourceListSize);
            assert.equal(0, listUtility.settings.visitedIndexes.length);
            assert.equal(true, listUtility.settings.resetWhenFull);
        });

        it('should throw SyntaxError when sourceListSize is 0', function () {

            let options = {
                sourceListSize: 0
            };

            expect(() => new ListUtility(options)).to.throw(SyntaxError, 'sourceListSize must be greater than 0');
        });

        it('should use options for settings when passed', function () {
            let options = {
                sourceListSize: 3,
                visitedIndexes: [1,2],
                resetWhenFull: false
            };

            let listUtility = new ListUtility(options);

            assert.equal(3, listUtility.settings.sourceListSize);
            assert.equal(2, listUtility.settings.visitedIndexes.length);
            assert.equal(false, listUtility.settings.resetWhenFull);
        });
    });

    describe('getFirstIndex', function () {
        it('should return index 0 when passed visitedIndexes is empty', function () {
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

        it('should return next index each call', function () {
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

        it('should return next index on call with ordered visitedIndexes', function () {
            let myIndexes = [0,1]; //ordered

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

        it('should return lowest index on call with unordered visitedIndexes', function () {
            let myIndexes = [3,0,2]; //unordered

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

        it('should reset visitedIndexes when full', function () {
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
        });

        it('should throw RangeError when resetWhenFull is false and visitedIndexes is full', function () {
            let myIndexes = [0,1,2,3];

            let options = {
                sourceListSize: 4,
                visitedIndexes: myIndexes,
                resetWhenFull: false
            };

            let listUtility = new ListUtility(options);

            expect(() => listUtility.getFirstIndex()).to.throw(RangeError, 'All indexes have been visited');
            expect(() => listUtility.getFirstIndex()).to.throw(RangeError, 'All indexes have been visited');
        });
    });

    describe('getLastIndex', function () {
        it('should return hightest index when passed visitedIndexes is empty', function () {
            let myIndexes = [];

            let options = {
                sourceListSize: 2,
                visitedIndexes: myIndexes
            };

            let listUtility = new ListUtility(options);
            let result = listUtility.getLastIndex();

            assert.equal(1, result.index);
            assert.equal(1, result.newVisitedIndexes.length);
            assert.deepEqual([1], result.newVisitedIndexes);
            assert.deepEqual([], myIndexes);
        });

        it('should return previous index each call', function () {
            let myIndexes = [];

            let options = {
                sourceListSize: 4,
                visitedIndexes: myIndexes
            };

            let listUtility = new ListUtility(options);
            let result = listUtility.getLastIndex();
            assert.equal(3, result.index);
            assert.equal(1, result.newVisitedIndexes.length);
            assert.deepEqual([3], result.newVisitedIndexes);
            assert.deepEqual([], myIndexes);

            result = listUtility.getLastIndex();
            assert.equal(2, result.index);
            assert.equal(2, result.newVisitedIndexes.length);
            assert.deepEqual([3,2], result.newVisitedIndexes);
            assert.deepEqual([], myIndexes);
            
            result = listUtility.getLastIndex();
            assert.equal(1, result.index);
            assert.equal(3, result.newVisitedIndexes.length);
            assert.deepEqual([3,2,1], result.newVisitedIndexes);
            assert.deepEqual([], myIndexes);

            result = listUtility.getLastIndex();
            assert.equal(0, result.index);
            assert.equal(4, result.newVisitedIndexes.length);
            assert.deepEqual([3,2,1,0], result.newVisitedIndexes);
            assert.deepEqual([], myIndexes);
        });

        it('should return previous index on call with ordered visitedIndexes', function () {
            let myIndexes = [3,2]; //ordered

            let options = {
                sourceListSize: 4,
                visitedIndexes: myIndexes
            };

            let listUtility = new ListUtility(options);
            let result = listUtility.getLastIndex();
            assert.equal(1, result.index);
            assert.equal(3, result.newVisitedIndexes.length);
            assert.deepEqual([3,2,1], result.newVisitedIndexes);
            assert.deepEqual([3,2], myIndexes);
        });

        it('should return highest index on call with unordered visitedIndexes', function () {
            let myIndexes = [3,0,2]; //unordered

            let options = {
                sourceListSize: 4,
                visitedIndexes: myIndexes
            };

            let listUtility = new ListUtility(options);
            let result = listUtility.getLastIndex();
            assert.equal(1, result.index);
            assert.equal(4, result.newVisitedIndexes.length);
            assert.deepEqual([3,0,2,1], result.newVisitedIndexes);
            assert.deepEqual([3,0,2], myIndexes);
        });

        it('should reset visitedIndexes when full', function () {
            let myIndexes = [0,1,2,3];

            let options = {
                sourceListSize: 4,
                visitedIndexes: myIndexes
            };

            let listUtility = new ListUtility(options);
            let result = listUtility.getLastIndex();
            assert.equal(3, result.index);
            assert.equal(1, result.newVisitedIndexes.length);
            assert.deepEqual([3], result.newVisitedIndexes);
            assert.deepEqual([0,1,2,3], myIndexes);
        });

        it('should throw RangeError when resetWhenFull is false and visitedIndexes is full', function () {
            let myIndexes = [0,1,2,3];

            let options = {
                sourceListSize: 4,
                visitedIndexes: myIndexes,
                resetWhenFull: false
            };

            let listUtility = new ListUtility(options);
            expect(() => listUtility.getLastIndex()).to.throw(RangeError, 'All indexes have been visited');
            expect(() => listUtility.getLastIndex()).to.throw(RangeError, 'All indexes have been visited');
        });
    });

    describe('getRandomIndex', function () {
        it('should return an index between min and max when passed visitedIndexes is empty', function () {
            let myIndexes = [];

            let options = {
                sourceListSize: 100,
                visitedIndexes: myIndexes
            };

            let listUtility = new ListUtility(options);
            let result = listUtility.getRandomIndex();

            expect(result.index).to.be.within(0, 99);
            assert.equal(1, result.newVisitedIndexes.length);

            let outVisitedIndexes = [];
            outVisitedIndexes.push(result.index);
            assert.deepEqual(outVisitedIndexes, result.newVisitedIndexes);
            assert.deepEqual([], myIndexes);
        });

        it('should return random index each call', function () {
                let myIndexes = [];

                let options = {
                    sourceListSize: 10,
                    visitedIndexes: myIndexes
                };

                let listUtility = new ListUtility(options);

                let result = listUtility.getRandomIndex();
                expect(result.index).to.be.within(0, 9);
                assert.equal(1, result.newVisitedIndexes.length);
                assert.deepEqual([], myIndexes);

                result = listUtility.getRandomIndex();
                expect(result.index).to.be.within(0, 9);
                assert.equal(2, result.newVisitedIndexes.length);
                assert.deepEqual([], myIndexes);

                result = listUtility.getRandomIndex();
                expect(result.index).to.be.within(0, 9);
                assert.equal(3, result.newVisitedIndexes.length);
                assert.deepEqual([], myIndexes);

                result = listUtility.getRandomIndex();
                expect(result.index).to.be.within(0, 9);
                assert.equal(4, result.newVisitedIndexes.length);
                assert.deepEqual([], myIndexes);

                result = listUtility.getRandomIndex();
                expect(result.index).to.be.within(0, 9);
                assert.equal(5, result.newVisitedIndexes.length);
                assert.deepEqual([], myIndexes);

                result = listUtility.getRandomIndex();
                expect(result.index).to.be.within(0, 9);
                assert.equal(6, result.newVisitedIndexes.length);
                assert.deepEqual([], myIndexes);

                result = listUtility.getRandomIndex();
                expect(result.index).to.be.within(0, 9);
                assert.equal(7, result.newVisitedIndexes.length);
                assert.deepEqual([], myIndexes);

                result = listUtility.getRandomIndex();
                expect(result.index).to.be.within(0, 9);
                assert.equal(8, result.newVisitedIndexes.length);
                assert.deepEqual([], myIndexes);

                result = listUtility.getRandomIndex();
                expect(result.index).to.be.within(0, 9);
                assert.equal(9, result.newVisitedIndexes.length);
                assert.deepEqual([], myIndexes);

                result = listUtility.getRandomIndex();
                expect(result.index).to.be.within(0, 9);
                assert.equal(10, result.newVisitedIndexes.length);
                assert.deepEqual([], myIndexes);

                assert.notDeepEqual([0,1,2,3,4,5,6,7,8,9], result.newVisitedIndexes);
                assert.notDeepEqual([9,8,7,6,5,4,3,2,1,0], result.newVisitedIndexes);
        });

        it('should return random index on call with existing visitedIndexes', function () {
            let myIndexes = [3,2]; 

            let options = {
                sourceListSize: 4,
                visitedIndexes: myIndexes
            };

            let listUtility = new ListUtility(options);
            let result = listUtility.getRandomIndex();  

            expect(result.index).to.be.within(0, 1);
            assert.equal(3, result.newVisitedIndexes.length);
            assert.deepEqual([3,2], myIndexes);
        });

        it('should reset visitedIndexes when full', function () {
            let myIndexes = [0,1,2,3];

            let options = {
                sourceListSize: 4,
                visitedIndexes: myIndexes
            };

            let listUtility = new ListUtility(options);
            let result = listUtility.getRandomIndex();
            expect(result.index).to.be.within(0, 3);
            assert.equal(1, result.newVisitedIndexes.length);
            assert.deepEqual([0,1,2,3], myIndexes);
        });

        it('should throw RangeError when resetWhenFull is false and visitedIndexes is full', function () {
            let myIndexes = [0,1,2,3];

            let options = {
                sourceListSize: 4,
                visitedIndexes: myIndexes,
                resetWhenFull: false
            };

            let listUtility = new ListUtility(options);
            expect(() => listUtility.getRandomIndex()).to.throw(RangeError, 'All indexes have been visited');
            expect(() => listUtility.getRandomIndex()).to.throw(RangeError, 'All indexes have been visited');
        });

    });
});