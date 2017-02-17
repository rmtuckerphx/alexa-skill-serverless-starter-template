'use strict';

const config = require('../../src/config/dev.skill.config');

const expect = require( 'chai' ).expect;
const assert = require( 'chai' ).assert;

const winston = require("winston");
const clearRequire = require('clear-require'); 
const functionName = "handler";
const timeoutMs = 3000;
const region = config.region;
const profileName = config.awsProfile;
const useLocalTranslations = true;

winston.level = "error";



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

    context('LaunchRequest', function () {
        let done, err;

        before(function (cb) {
            const lambdalocal = require("lambda-local");
            lambdalocal.setLogger(winston);
            const lambda = require('../../src/main.js');
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

        after(function () {
            clearRequire('../../src/main.js');
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

    context('GetFactByNumberIntent (newSession: true)', function () {
        let done, err;

        before(function (cb) {
            const lambdalocal = require("lambda-local");
            lambdalocal.setLogger(winston);
            const lambda = require('../../src/main.js');
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

        after(function () {
            clearRequire('../../src/main.js');
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

    context('GetFactByNumberIntent (newSession: false)', function () {
        let done, err;

        before(function (cb) {
            const lambdalocal = require("lambda-local");
            lambdalocal.setLogger(winston);
            const lambda = require('../../src/main.js');
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

        after(function () {
            clearRequire('../../src/main.js');
        })         

        it('should return outputSpeech matching string', function () {
            expect(done.response.outputSpeech.ssml).to.have.string('<speak> Fact 4: Alexa is my friend');
        });

        it('should return reprompt outputSpeech', function () {
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

    context('GetNewFactIntent (newSession: true)', function () {
        let done, err;

        before(function (cb) {
            const lambdalocal = require("lambda-local");
            lambdalocal.setLogger(winston);
            const lambda = require('../../src/main.js');
            let event = getEvent('GetNewFactIntent.json', true);

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

        after(function () {
            clearRequire('../../src/main.js');
        })   

        it('should return outputSpeech matching string', function () {
            expect(done.response.outputSpeech.ssml).to.have.string('<speak> Fact ');
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

        it('should have card type Simple', function () {
            expect(done.response.card.type).to.have.string('Simple');
        });

        it('should have card title starts with Fact', function () {
            expect(done.response.card.title).to.have.string('Fact ');
        });

        it('should have card content', function () {
            expect(done.response.card.content).to.exist;
            expect(done.response.card.content).to.be.a('string');
        });

        it('should return visitedFactIndexes with one item', function () {
            expect(done.sessionAttributes.visitedFactIndexes.length).to.equal(1);
        });

    });

    context('GetNewFactIntent (newSession: false)', function () {
        let done, err;

        before(function (cb) {
            const lambdalocal = require("lambda-local");
            lambdalocal.setLogger(winston);
            const lambda = require('../../src/main.js');
            let event = getEvent('GetNewFactIntent.json', false);

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

        after(function () {
            clearRequire('../../src/main.js');
        })   

        it('should return outputSpeech matching string', function () {
            expect(done.response.outputSpeech.ssml).to.have.string('<speak> Fact ');
        });

        it('should return reprompt outputSpeech', function () {
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

        it('should have card type Simple', function () {
            expect(done.response.card.type).to.have.string('Simple');
        });

        it('should have card title starts with Fact', function () {
            expect(done.response.card.title).to.have.string('Fact ');
        });

        it('should have card content', function () {
            expect(done.response.card.content).to.exist;
            expect(done.response.card.content).to.be.a('string');
        });

        // not sure why this test is not run in isolation of the others
        it.skip('should return visitedFactIndexes with one item', function () {
            expect(done.sessionAttributes.visitedFactIndexes.length).to.equal(1);
        });
    });

    context('AMAZON.RepeatIntent', function () {
        let done, err, event;

        before(function (cb) {
            const lambdalocal = require("lambda-local");
            lambdalocal.setLogger(winston);
            const lambda = require('../../src/main.js');
            event = getEvent('AMAZON.RepeatIntent.json');

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

        after(function () {
            clearRequire('../../src/main.js');
        })           

        it('should return outputSpeech matching string', function () {
            expect(done.response.outputSpeech.ssml).to.have.string("Here are some things you can say: Tell me fact number three. Tell me a new fact. Goodbye. Repeat. If you're done, you can also say: stop. So, how can I help?");
        });

        it('should return reprompt outputSpeech matching string', function () {
            expect(done.response.reprompt.outputSpeech.ssml).to.have.string('How can I help you?');
        });
        
        it('should have shouldEndSession equal to false', function () {
            assert.equal(done.response.shouldEndSession, false);
        });

        it('should have sessionAttributes.speechOutput that is the same as original request event', function () {
            expect(done.sessionAttributes.speechOutput).to.have.string(event.session.attributes.speechOutput);
        });

        it('should have sessionAttributes.repromptSpeech that is the same as original request event', function () {
            expect(done.sessionAttributes.repromptSpeech).to.have.string(event.session.attributes.repromptSpeech);
        });
    });
    
    context('SessionEndedRequest', function () {
        let done, err;

        before(function (cb) {
            const lambdalocal = require("lambda-local");
            lambdalocal.setLogger(winston);
            const lambda = require('../../src/main.js');
            let event = getEvent('SessionEndedRequest.json');

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

        after(function () {
            clearRequire('../../src/main.js');
        })           

        it('should return outputSpeech matching string', function () {
            expect(done.response.outputSpeech.ssml).to.have.string('<speak> Goodbye and Thank you! </speak>');
        });

        it('should not return reprompt outputSpeech', function () {
            expect(done.response.reprompt).to.not.exist;
        });
        
        it('should have shouldEndSession equal to true', function () {
            assert.equal(done.response.shouldEndSession, true);
        });

        it('should set sessionAttributes.speechOutput to space', function () {
            expect(done.sessionAttributes.speechOutput).to.have.string(' ');
        });

        it('should set sessionAttributes.repromptSpeech to space', function () {
            expect(done.sessionAttributes.repromptSpeech).to.have.string(' ');
        });
    });

    context('AMAZON.StopIntent', function () {
        let done, err;

        before(function (cb) {
            const lambdalocal = require("lambda-local");
            lambdalocal.setLogger(winston);
            const lambda = require('../../src/main.js');
            let event = getEvent('AMAZON.StopIntent.json');

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

        after(function () {
            clearRequire('../../src/main.js');
        })           

        it('should return outputSpeech matching string', function () {
            expect(done.response.outputSpeech.ssml).to.have.string('<speak> Goodbye and Thank you! </speak>');
        });

        it('should not return reprompt outputSpeech', function () {
            expect(done.response.reprompt).to.not.exist;
        });
        
        it('should have shouldEndSession equal to true', function () {
            assert.equal(done.response.shouldEndSession, true);
        });

        it('should set sessionAttributes.speechOutput to space', function () {
            expect(done.sessionAttributes.speechOutput).to.have.string(' ');
        });

        it('should set sessionAttributes.repromptSpeech to space', function () {
            expect(done.sessionAttributes.repromptSpeech).to.have.string(' ');
        });
    });

    context('AMAZON.CancelIntent', function () {
        let done, err;

        before(function (cb) {
            const lambdalocal = require("lambda-local");
            lambdalocal.setLogger(winston);
            const lambda = require('../../src/main.js');
            let event = getEvent('AMAZON.CancelIntent.json');

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

        after(function () {
            clearRequire('../../src/main.js');
        })           

        it('should return outputSpeech matching string', function () {
            expect(done.response.outputSpeech.ssml).to.have.string('<speak> Goodbye and Thank you! </speak>');
        });

        it('should not return reprompt outputSpeech', function () {
            expect(done.response.reprompt).to.not.exist;
        });
        
        it('should have shouldEndSession equal to true', function () {
            assert.equal(done.response.shouldEndSession, true);
        });

        it('should set sessionAttributes.speechOutput to space', function () {
            expect(done.sessionAttributes.speechOutput).to.have.string(' ');
        });

        it('should set sessionAttributes.repromptSpeech to space', function () {
            expect(done.sessionAttributes.repromptSpeech).to.have.string(' ');
        });
    });

    context('AMAZON.HelpIntent', function () {
        let done, err;

        before(function (cb) {
            const lambdalocal = require("lambda-local");
            lambdalocal.setLogger(winston);
            const lambda = require('../../src/main.js');
            let event = getEvent('AMAZON.HelpIntent.json');

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

        after(function () {
            clearRequire('../../src/main.js');
        })           

        it('should return outputSpeech matching string', function () {
            expect(done.response.outputSpeech.ssml).to.have.string('<speak> Here are some things you can say: ');
        });

        it('should return reprompt outputSpeech matching string', function () {
            expect(done.response.reprompt.outputSpeech.ssml).to.have.string('<speak> How can I help you? </speak>');
        });
        
        it('should have shouldEndSession equal to false', function () {
            assert.equal(done.response.shouldEndSession, false);
        });

        it('should set sessionAttributes.speechOutput to same as response.outputSpeech.ssml', function () {
            expect(done.response.outputSpeech.ssml).to.have.string(done.sessionAttributes.speechOutput);
        });

        it('should set sessionAttributes.repromptSpeech to same as response.outputSpeech.ssml', function () {
            expect(done.response.reprompt.outputSpeech.ssml).to.have.string(done.sessionAttributes.repromptSpeech);
        });

    });

    context('Unhandled', function () {
        let done, err;

        before(function (cb) {
            const lambdalocal = require("lambda-local");
            lambdalocal.setLogger(winston);
            const lambda = require('../../src/main.js');
            let event = getEvent('Unhandled.json');

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

        after(function () {
            clearRequire('../../src/main.js');
        })           

        it('should return outputSpeech matching string', function () {
            expect(done.response.outputSpeech.ssml).to.have.string('<speak> Can you please repeat your request? </speak>');
        });

        it('should return reprompt outputSpeech matching string', function () {
            expect(done.response.reprompt.outputSpeech.ssml).to.have.string('<speak> If you are not sure what to ask, say help. To end, you can say: stop. </speak>');
        });
        
        it('should have shouldEndSession equal to false', function () {
            assert.equal(done.response.shouldEndSession, false);
        });

        it('should set sessionAttributes.speechOutput to same as response.outputSpeech.ssml', function () {
            expect(done.response.outputSpeech.ssml).to.have.string(done.sessionAttributes.speechOutput);
        });

        it('should set sessionAttributes.repromptSpeech to same as response.outputSpeech.ssml', function () {
            expect(done.response.reprompt.outputSpeech.ssml).to.have.string(done.sessionAttributes.repromptSpeech);
        });

    });
});