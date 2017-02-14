'use strict';

const config = require('../../src/config/dev.skill.config');

const expect = require( 'chai' ).expect;
const assert = require( 'chai' ).assert;

const lambdalocal = require("lambda-local");
const winston = require("winston");
const lambda = require('../../src/main.js');

const functionName = "handler";
const timeoutMs = 3000;
const region = config.region;
const profileName = config.awsProfile;
const useLocalTranslations = true;

winston.level = "error";
lambdalocal.setLogger(winston);


function getEvent(test) {
    let event = require(`../requests/${ test.fileName }`);

    event.session.application.applicationId = config.skillAppID;

    if (event.context && event.context.System && event.context.System.application) {
        event.context.System.application.applicationId = config.skillAppID;
    }
    event.request.useLocalTranslations = useLocalTranslations;  

    if (test.newSession)  {
        event.session.new = test.newSession;
    }

    return event;
}

describe('Meetup Sample', function () {

    let tests = [
        {
            name: 'LaunchRequest',
            fileName: 'LaunchRequest.json',
            outputSpeech: 'can share facts and maybe do other things.  For more details, say help. So, what would you like? </speak>',
            shouldEndSession: false
        },
        {
            name: 'GetFactByNumberIntent (newSession: true)',
            fileName: 'GetFactByNumberIntent.json',
            outputSpeech: '<speak> Fact 4: Alexa is my friend <break time="500ms"/>',
            shouldEndSession: true,
            newSession: true
        },
        {
            name: 'GetFactByNumberIntent (newSession: false)',
            fileName: 'GetFactByNumberIntent.json',
            outputSpeech: '<speak> Fact 4: Alexa is my friend <break time="500ms"/>',
            shouldEndSession: false,
            newSession: false
        }
    ];

    tests.forEach(function(test) {
        let event = getEvent(test);

        describe(test.name, function () {
            let done, err;

            before(function (cb) {

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

                        cb();
                    }
                });
            });

            if (test.speechOutput) {
                it('should return outputSpeech containing string', function () {
                    expect(done.response.outputSpeech.ssml).to.have.string(test.speechOutput);
                });
            }

            if (test.shouldEndSession) {
                it('should have shouldEndSession equal to ' + test.shouldEndSession, function () {
                    assert.equal(done.response.shouldEndSession, test.shouldEndSession);
                });
            }
        });

    });
});
