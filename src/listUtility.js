'use strict';
const _ = require('lodash');

const nextIndexTypes = {
        Random: 'random',
        First: 'first',
        Last: 'last'
    };

// constructor
function ListUtility(options) {

    let defaults = {
        sourceListSize: 0,
        visitedIndexes: [],
        resetWhenFull: true
    };

    // always initialize all instance properties
    this.settings = Object.assign({}, defaults, options);
    this._visitedIndexes = this.settings.visitedIndexes.slice(0); //clone array

    if (this.settings.sourceListSize === 0) {
        throw new SyntaxError('sourceListSize must be greater than 0');
    }
}

// class methods
ListUtility.prototype._getNextIndex = function(nextIndexType) {   
    const all = _.range(this.settings.sourceListSize);
    let notVisited = _.difference(all, this._visitedIndexes);
    let index = -1;

    if (notVisited.length === 0) {
        if (this.settings.resetWhenFull) {
            this._visitedIndexes.length = 0; //clear array
            notVisited = _.difference(all, this._visitedIndexes);
        }
        else {
            throw new RangeError('All indexes have been visited and resetWhenFull is set to false');
        }
    }

    switch (nextIndexType) {
        case nextIndexTypes.First:
            index = _.head(notVisited);
            break;

        case nextIndexTypes.Last:
            index = _.last(notVisited);    
            break;
    
        default:
            index = _.sample(notVisited);
            break;
    }

    this._visitedIndexes.push(index);

    return {
        index: index, 
        newVisitedIndexes: this._visitedIndexes
    };
};

ListUtility.prototype.getFirstIndex = function() {
    return this._getNextIndex(nextIndexTypes.First);
};

ListUtility.prototype.getLastIndex = function() {
    return this._getNextIndex(nextIndexTypes.Last);
};

ListUtility.prototype.getRandomIndex = function() {
    return this._getNextIndex(nextIndexTypes.Random);
};

ListUtility.prototype.getIndexFromValue = function(value) {

    let index = value - 1;

    if (index < 0 || index >= this.settings.sourceListSize) {
        index = -1;
    }
    else {

        const all = _.range(this.settings.sourceListSize);
        let notVisited = _.difference(all, this._visitedIndexes);

        if (notVisited.length === 0) {
            if (this.settings.resetWhenFull) {
                this._visitedIndexes.length = 0; //clear array
                notVisited = _.difference(all, this._visitedIndexes);
            }
            else {
                throw new RangeError('All indexes have been visited and resetWhenFull is set to false');
            }
        }

        this._visitedIndexes.push(index);

    }
    
    return {
        index: index, 
        newVisitedIndexes: this._visitedIndexes
    };
};

module.exports = ListUtility
