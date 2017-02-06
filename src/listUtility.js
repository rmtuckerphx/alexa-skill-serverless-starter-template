'use strict';

// constructor
function ListUtility(params) {
    // always initialize all instance properties
    this.sourceListSize = params.sourceListSize || 0;
    this.visitedIndexes = params.visitedIndexes || [];
}

// class methods
ListUtility.prototype.getFirstIndex = function() {
    return null;
};

module.exports = ListUtility
