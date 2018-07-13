/*jslint node: true */
"use strict";

console.log('Handler: defaultHandlers');

const Config = require('../config/skill.config');

const defaultHandlers = {

    'LaunchRequest': function () {
        console.log('LaunchRequest');

        let ssmlResponse = this.t('welcome');
        console.log(JSON.stringify(ssmlResponse, null, '  '));

        this.attributes.speechOutput = ssmlResponse.speechOutput;
        this.attributes.repromptSpeech = ssmlResponse.reprompt;

        this.emit(':ask', ssmlResponse.speechOutput, ssmlResponse.reprompt);
    },

    'AMAZON.RepeatIntent': function () {
        console.log('AMAZON.RepeatIntent');

        let intent = this.event.request.intent;

        let ssmlResponse = {
            speechOutput: this.attributes.speechOutput,
            reprompt: this.attributes.repromptSpeech
        };

        this.emit(':ask', ssmlResponse.speechOutput, ssmlResponse.reprompt)
    },

    'AMAZON.CancelIntent': function () {
        console.log('AMAZON.CancelIntent');

        this.emit('SessionEndedRequest');
    },

    'AMAZON.StopIntent': function () {
        console.log('AMAZON.StopIntent');

        this.emit('SessionEndedRequest');
    },

    'SessionEndedRequest': function () {
        console.log('SessionEndedRequest');

        let ssmlResponse = this.t('goodbye', Config.s3.bucketName);

        this.attributes.speechOutput = " ";
        this.attributes.repromptSpeech = " ";

        this.emit(':tell', ssmlResponse.speechOutput); // :tell* or :saveState handler required here to save attributes to DynamoDB
    },

    'AMAZON.HelpIntent': function () {
        console.log('AMAZON.HelpIntent');

        let intent = this.event.request.intent;

        let ssmlResponse = this.t('help');

        this.attributes.speechOutput = ssmlResponse.speechOutput;
        this.attributes.repromptSpeech = ssmlResponse.reprompt;

        this.emit(':ask', ssmlResponse.speechOutput, ssmlResponse.reprompt);
    },
    'Unhandled': function () {
        console.log('Unhandled');

        let ssmlResponse = this.t('unhandled');

        this.attributes.speechOutput = ssmlResponse.speechOutput;
        this.attributes.repromptSpeech = ssmlResponse.reprompt;

        this.emit(':ask', ssmlResponse.speechOutput, ssmlResponse.reprompt);
    }
};

module.exports = defaultHandlers;