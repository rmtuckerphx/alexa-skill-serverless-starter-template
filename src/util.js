'use strict';

module.exports = (function () {
  'use strict';
  
  return {

    replaceTags: function (text) {
      return text.replace(/(<([^>]+)>)/ig, "");
    },

  };
})();
