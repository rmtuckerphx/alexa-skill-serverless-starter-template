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


function getEvent(fileName, isNewSession) {
    let event = require(`../requests/${ fileName }`);

    event.session.application.applicationId = config.skillAppID;

    if (event.context && event.context.System && event.context.System.application) {
        event.context.System.application.applicationId = config.skillAppID;
    }
    event.request.useLocalTranslations = useLocalTranslations;  

    if (isNewSession !== undefined)  {
        event.session.new = isNewSession;
    }

    return event;
}

describe('Meetup Sample', function () {

    context('LaunchRequest', function (cb) {
        let done, err;

        before(function (cb) {
            let event = getEvent('LaunchRequest.json');

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
        })

        it('should return outputSpeech matching string', function () {
            expect(done.response.outputSpeech.ssml).to.have.string('can share facts and maybe do other things.  For more details, say help. So, what would you like? </speak>');
        });

        it('should return reprompt outputSpeech matching string', function () {
            expect(done.response.reprompt.outputSpeech.ssml).to.be.a('string');
        });
        
        it('should have shouldEndSession equal to false', function () {
            assert.equal(done.response.shouldEndSession, false);
        });

        it('should set sessionAttributes.speechOutput to same as response.outputSpeech.ssml (without tags)', function () {
            expect(done.response.outputSpeech.ssml).to.have.string(done.sessionAttributes.speechOutput);
        });

        it('should set sessionAttributes.repromptSpeech to same as response.reprompt.outputSpeech.ssml (without tags)', function () {
            expect(done.response.reprompt.outputSpeech.ssml).to.have.string(done.sessionAttributes.repromptSpeech);
        });
    });

    context('GetFactByNumberIntent (newSession: true)', function (cb) {
        let done, err;

        before(function (cb) {
            let event = getEvent('GetFactByNumberIntent.json', true);

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
        })

        it('should return outputSpeech matching string', function () {
            expect(done.response.outputSpeech.ssml).to.have.string('<speak> Fact 4: Alexa is my friend  </speak>');
        });

        it('should not return reprompt outputSpeech', function () {
            expect(done.response.reprompt).to.not.exist;
        });
        
        it('should have shouldEndSession equal to true', function () {
            assert.equal(done.response.shouldEndSession, true);
        });

        it('should set sessionAttributes.speechOutput to same as response.outputSpeech.ssml (without tags)', function () {
            expect(done.response.outputSpeech.ssml).to.have.string(done.sessionAttributes.speechOutput);
        });

        it('should set sessionAttributes.repromptSpeech to space', function () {
            expect(done.sessionAttributes.repromptSpeech).to.have.string(' ');
        });

        it('should return card equal to object', function () {
            expect(done.response.card).to.deep.equal( 
                {   
                    type: 'Simple',
                    title: 'Fact 4',
                    content: 'Alexa is my friend' 
                });
        });

        it('should return visitedFactIndexes equal to [3]', function () {
            expect(done.sessionAttributes.visitedFactIndexes).to.deep.equal([3]);
        });

    });

    context('GetFactByNumberIntent (newSession: false)', function (cb) {
        let done, err;

        before(function (cb) {
            let event = getEvent('GetFactByNumberIntent.json', false);

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
        })

        it('should return outputSpeech matching string', function () {
            expect(done.response.outputSpeech.ssml).to.have.string('<speak> Fact 4: Alexa is my friend');
        });

        it('should not return reprompt outputSpeech', function () {
            expect(done.response.reprompt).to.exist;
        });
        
        it('should have shouldEndSession equal to false', function () {
            assert.equal(done.response.shouldEndSession, false);
        });

        it('should set sessionAttributes.speechOutput to same as response.outputSpeech.ssml (without tags)', function () {
            expect(done.response.outputSpeech.ssml).to.have.string(done.sessionAttributes.speechOutput);
        });

        it('should set sessionAttributes.repromptSpeech to space', function () {
            expect(done.sessionAttributes.repromptSpeech).to.have.string(' ');
        });

        it('should return card equal to object', function () {
            expect(done.response.card).to.deep.equal( 
                {   
                    type: 'Simple',
                    title: 'Fact 4',
                    content: 'Alexa is my friend' 
                });
        });

        it('should return visitedFactIndexes equal to [3]', function () {
            expect(done.sessionAttributes.visitedFactIndexes).to.deep.equal([3]);
        });

    });

});