'use strict';
var _ = require('lodash');


module.exports = (function () {
  'use strict';
  
  
  var _nextIndexOptions = {
    Random: 'random',
    First: 'first',
    Last: 'last'
  }

  return {
    nextIndexOptions: _nextIndexOptions,

    getNextIndex: function (list, attributes, attributeKey, option) {
      if (attributes[attributeKey] === undefined || attributes[attributeKey].length >= list.length) {
        attributes[attributeKey] = [];
      }

      var all = _.range(list.length);
      var visited = attributes[attributeKey];
      var notVisited = _.difference(all, visited);



      switch (option) {
        case _nextIndexOptions.First:
          var index = _.head(notVisited);
          break;

        case _nextIndexOptions.Last:
          var index = _.last(notVisited);    
          break;
      
        default:
          index = _.sample(notVisited);
          break;
      }

      return index;
    },

    replaceTags: function (text) {
      return text.replace(/(<([^>]+)>)/ig, "");
    },

    persistIndexToAttributes: function (list, index, attributes, key) {

      var isValidIndex = false;

      if (attributes[key] === undefined) {
        attributes[key] = [];
      }

      if (index >= 0 && index < list.length) {

        attributes[key].push(index);
        attributes[key] = _.uniq(attributes[key]);

        isValidIndex = true;
      }

      return isValidIndex;
    }

  };
})();
