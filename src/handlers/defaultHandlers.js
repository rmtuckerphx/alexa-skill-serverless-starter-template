/*jslint node: true */
"use strict";

console.log('Handler: defaultHandlers');

const _ = require('lodash');
const Config = require('../config/skill.config');
//VI-REMOVE:const VoiceLabs = require('voicelabs')(Config.trackingToken);

const defaultHandlers = {

    'LaunchRequest': function () {
        console.log('LaunchRequest');

        let ssmlResponse = this.t('welcome');
        console.log(JSON.stringify(ssmlResponse, null, '  '));

        this.attributes.speechOutput = ssmlResponse.speechOutput;
        this.attributes.repromptSpeech = ssmlResponse.reprompt;

        console.log('LaunchRequest VoiceLabs.track');
        //VI-REMOVE:VoiceLabs.track(this.event.session, 'LaunchRequest', null, ssmlResponse.speechOutput, (error, response) => {
            //VI-REMOVE:console.log('error: ' + JSON.stringify(error, null, '  ') + '; response: ' + JSON.stringify(response, null, '  '));
            this.emit(':ask', ssmlResponse.speechOutput, ssmlResponse.reprompt);
        //VI-REMOVE:});
    },

    'AMAZON.RepeatIntent': function () {
        console.log('AMAZON.RepeatIntent');

        let intent = this.event.request.intent;

        let ssmlResponse = {
            speechOutput: this.attributes.speechOutput,
            reprompt: this.attributes.repromptSpeech
        };

        //VI-REMOVE:VoiceLabs.track(this.event.session, intent.name, null, ssmlResponse.speechOutput, (error, response) => {
            this.emit(':ask', ssmlResponse.speechOutput, ssmlResponse.reprompt)
        //VI-REMOVE:});
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

        let ssmlResponse = this.t('goodbye');

        this.attributes.speechOutput = " ";
        this.attributes.repromptSpeech = " ";

        //VI-REMOVE:VoiceLabs.track(this.event.session, 'SessionEnd', null, ssmlResponse.speechOutput, (error, response) => {
            this.emit(':tell', ssmlResponse.speechOutput); // :tell* or :saveState handler required here to save attributes to DynamoDB
        //VI-REMOVE:});
    },

    'AMAZON.HelpIntent': function () {
        console.log('AMAZON.HelpIntent');

        let intent = this.event.request.intent;

        let ssmlResponse = this.t('help');

        this.attributes.speechOutput = ssmlResponse.speechOutput;
        this.attributes.repromptSpeech = ssmlResponse.reprompt;

        //VI-REMOVE:VoiceLabs.track(this.event.session, intent.name, null, ssmlResponse.speechOutput, (error, response) => {
            this.emit(':ask', ssmlResponse.speechOutput, ssmlResponse.reprompt);
        //VI-REMOVE:});
    },
    'Unhandled': function () {
        console.log('Unhandled');

        let ssmlResponse = this.t('unhandled');

        this.attributes.speechOutput = ssmlResponse.speechOutput;
        this.attributes.repromptSpeech = ssmlResponse.reprompt;

        //VI-REMOVE:VoiceLabs.track(this.event.session, 'Unhandled', null, ssmlResponse.speechOutput, (error, response) => {
            this.emit(':ask', ssmlResponse.speechOutput, ssmlResponse.reprompt);
        //VI-REMOVE:});
    }
};

module.exports = defaultHandlers;