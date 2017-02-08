'use strict';
const _ = require('lodash');

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
}

// class methods
ListUtility.prototype.getFirstIndex = function() {

    const all = _.range(this.settings.sourceListSize);
    let notVisited = _.difference(all, this._visitedIndexes);
    let isVisitedFull = false;
    let index = -1;

    if (notVisited.length == 0) {
        if (this.settings.resetWhenFull) {
            this._visitedIndexes.length = 0; //clear array
            notVisited = _.difference(all, this._visitedIndexes);
        }
        else {
            isVisitedFull = true;
        }
    }

    if (!isVisitedFull) {
        index = _.head(notVisited);
        this._visitedIndexes.push(index);
    }

    return {
        index: index, 
        newVisitedIndexes: this._visitedIndexes,
        isVisitedFull: isVisitedFull
    };
};

module.exports = ListUtility
