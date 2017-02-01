'use strict';
 const fs = require('fs');
 
module.exports = (function () {
  'use strict';

  return {

    getProfileName: function (skillNamespace, stage) {
      return skillNamespace + '-profile-' + stage;
    },

    getUserName: function (skillNamespace, stage) {
      return skillNamespace + '-user-' + stage;
    },

    getRoleName: function (skillNamespace, stage, region) {
      return skillNamespace + '-service-' + stage + '-' + region + '-lambdaRole';
    },

    modifyFiles: function (files, replacements) {
      files.forEach((file) => {
        let fileContentModified = fs.readFileSync(file, 'utf8')

        replacements.forEach((v) => {
          fileContentModified = fileContentModified.replace(v.regexp, v.replacement)
        })

        fs.writeFileSync(file, fileContentModified, 'utf8')
      })
    }
  };
})();
