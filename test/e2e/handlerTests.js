'use strict';

const lambdaCaller = require('../lambdaCaller');
const awsLambdaRole = require('../awsLambdaRole');
const skillConfig = require('../../src/config/dev.skill.config');
const expect = require( 'chai' ).expect;
const assert = require( 'chai' ).assert;

describe('Meetup Sample', function () {
    awsLambdaRole.assume();

    beforeEach(function () {

    });

    afterEach(function () {

    });

    describe('Welcome', function () {


        it('Executes LaunchRequest', function (done) {


            var context = {

                succeed: function( result ) {

                        assert.equal(result.response.outputSpeech.ssml, '<speak> Meetup Sample can share facts and maybe do other things.  For more details, say help. So, what would you like? </speak>');
                        done();
                    },

                fail: function() {

                        done( new Error( 'never context.fail' ) );
                    }
            }

            var event = require('../requests/LaunchRequest.json');
            lambdaCaller.execute(event, skillConfig.skillAppID, false, context);
        });

    });


    describe('Facts', function () {

        it('Executes GetFactByNumberIntent', function (done) {

            var context = {

                succeed: function( result ) {

                        expect(result.response.outputSpeech.ssml).to.have.string('<speak> Fact 4: Alexa is my friend <break time="500ms"/>');
                        done();
                    },

                fail: function() {

                        done( new Error( 'never context.fail' ) );
                    }
            }

            var event = require('../requests/GetFactByNumberIntent.json');
            lambdaCaller.execute(event, skillConfig.skillAppID, false, context);
        });

    });
});
