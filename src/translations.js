'use strict';
const aws = require('aws-sdk');
const Config = require('./config/skill.config');

const bucketName = Config.s3.bucketName;
const key = Config.s3.transKey;
let s3;
let resources;

module.exports = (function () {
  return {
    getResources: function (useLocal) {
      return new Promise(function(resolve, reject) {

        if (resources) {
          console.log('Translations - Use cached resources.');
          resolve(resources);

          return;
        }

        // useLocal parameter only used during local development
        useLocal = useLocal || false;

        if (useLocal) {
          console.log('Translations - Use local resources.');

          resources = require('./translations.json');
          resolve(resources);

          return;
        }

        if (!s3) {
          s3 = new aws.S3({ apiVersion: '2006-03-01' });
        }

        var params = {
          Bucket: bucketName,
          Key: key,
          ResponseContentType: 'application/json'
        };

        return s3.getObject(params).promise()
          .then(function(data) {
              console.log('Translations - Successful get of resources from S3: ' + bucketName + ', ' + key);

              resources = JSON.parse(data.Body.toString());
              resolve(resources);
          })
          .catch(function(err) {
              console.log('Translations - Error getting resources: ' + err.message);
              console.log('Translations - Use local resources.');

              resources = require('./translations.json');
              resolve(resources);
          });
      });
    }
  };
})();