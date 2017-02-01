'use strict';

var aws = require('aws-sdk');
var skillConfig = require('../src/config/dev.skill.config.json');
var devProfileName = skillConfig.skillNamespace + '-profile-dev';
// var devUserName = skillConfig.skillNamespace + '-user-dev';
// var devRoleName = skillConfig.skillNamespace + '-service-dev-' + skillConfig.region + '-lambdaRole';
// var devUserArn = null;
// var devRoleArn = null;

var credentials = new aws.SharedIniFileCredentials({ profile: devProfileName });
aws.config.credentials = credentials;

aws.config.region = skillConfig.region;

module.exports = (function () {
    'use strict';

    return {
        assume: function () {

            var sts = new aws.STS();
            sts.assumeRole({
                RoleArn: skillConfig.roleArn,
                RoleSessionName: 'emulambda'
            }, function (err, data) {
                if (err) { // an error occurred
                    console.log('Cannot assume role');
                    console.log(err, err.stack);
                } else { // successful response

                    aws.config.update({
                        accessKeyId: data.Credentials.AccessKeyId,
                        secretAccessKey: data.Credentials.SecretAccessKey,
                        sessionToken: data.Credentials.SessionToken
                    });

                    var Module = require('module');
                    var originalRequire = Module.prototype.require;

                    Module.prototype.require = function () {
                        if (arguments[0] === 'aws-sdk') {
                            return aws;
                        } else {
                            return originalRequire.apply(this, arguments);
                        }
                    };


                }
            });


        },

    };
})();
