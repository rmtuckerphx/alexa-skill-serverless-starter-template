var config = require('../../src/config/dev.skill.config');


// Set the request file to act as input to the Lambda function
var event = require('../requests/LaunchRequest.json');

event.session.application.applicationId = config.skillAppID;
event.request.useLocalTranslations = false;

var lambdalocal = require("lambda-local");
var winston = require("winston");
var lambda = require('../../src/main.js');

var functionName = "handler";
var timeoutMs = 3000;
var region = config.region;
var profileName = config.awsProfile;

winston.level = "error";
lambdalocal.setLogger(winston);



lambdalocal.execute({
    event: event,
    lambdaFunc: lambda,
    lambdaHandler: functionName,
    region: region,
    profileName : profileName,
    callbackWaitsForEmptyEventLoop: false,
    timeoutMs: timeoutMs,
    callback: function (_err, _done) {
        done = _done;
        err = _err;

        if (done) {
            console.log('context.done');
            console.log(done);
        }

        if (err) {
            console.log('context.err');
            console.log(err);
        }
    }
});