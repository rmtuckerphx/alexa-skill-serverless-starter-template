'use strict';

// var aws = require('aws-sdk');
// var skillConfig = require('../src/config/dev.skill.config.json');
// var devProfileName = skillConfig.skillNamespace + '-profile-dev';
// var devUserName = skillConfig.skillNamespace + '-user-dev';
// var devRoleName = skillConfig.skillNamespace + '-service-dev-' + skillConfig.region + '-lambdaRole';
// var devUserArn = null;
// var devRoleArn = null;
// aws.config.region = skillConfig.region;

// var credentials = new aws.SharedIniFileCredentials({ profile: devProfileName });
// aws.config.credentials = credentials;

module.exports = (function () {
    'use strict';

    function defaultContext() {
        var context = require('./context.json');
        context.done = function (error, result) {
            console.log('context.done');
            console.log(error);
            console.log(result);
            process.exit();
        }
        context.succeed = function (result) {
            console.log('context.succeed');
            console.log(result);
            process.exit();
        }
        context.fail = function (error) {
            console.log('context.fail');
            console.log(error);
            process.exit();
        }
        return context;
    }

    return {

        execute: function (event, applicationId, useLocalResources, context) {
            var lambda = require('../src/main.js');

            event.session.application.applicationId = applicationId;
            event.request.debug = useLocalResources;

            if (context === undefined) {
                context = defaultContext();
            }

            lambda.handler(event, context);
        },
    };
})();
