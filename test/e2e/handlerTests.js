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


describe('Meetup Sample', function () {

    describe('LaunchRequest', function () {
        let done, err;

        before(function (cb) {
            let event = require('../requests/LaunchRequest.json');
            event.session.application.applicationId = config.skillAppID;
            event.request.useLocalTranslations = useLocalTranslations;

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

        it('should return outputSpeech matching string', function () {
            expect(done.response.outputSpeech.ssml).to.have.string('can share facts and maybe do other things.  For more details, say help. So, what would you like? </speak>');
        });

        it('should have shouldEndSession equal to false', function () {
            assert.equal(done.response.shouldEndSession, false);
        });
    });


    describe('GetFactByNumberIntent', function () {
        let done, err;

        before(function (cb) {
            let event = require('../requests/GetFactByNumberIntent.json');
            event.session.application.applicationId = config.skillAppID;
            event.request.useLocalTranslations = useLocalTranslations;

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

        it('should return outputSpeech that contains matching string', function () {
            expect(done.response.outputSpeech.ssml).to.have.string('<speak> Fact 4: Alexa is my friend <break time="500ms"/>');
        });

    });

});
