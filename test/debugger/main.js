var lambdaCaller = require('../lambdaCaller');
var awsLambdaRole = require('../awsLambdaRole');
var skillConfig = require('../../src/config/dev.skill.config.json');

awsLambdaRole.assume();

//fix up applicationId before passing to handler
var event = require('../requests/LaunchRequest.json');
lambdaCaller.execute(event, skillConfig.skillAppID, true);
