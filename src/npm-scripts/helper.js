'use strict';
module.exports = (function () {
  'use strict';
  
  return {

    getProfileName: function (skillNamespace, stage) {
      return skillNamespace + '-profile-' + stage;
    },

    getUserName: function (skillNamespace, stage) {
      return skillNamespace + '-user-' + stage;
    },

  };
})();
