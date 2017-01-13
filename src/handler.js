'use strict';
var Alexa = require('alexa-sdk');

var _ = require('lodash');

var Translations = require('./translations');
var Config = require('../config/skill.config');
var Util = require('./util');
var FactsHelper = require('./factsHelper');


// module.exports.skill = (event, context, callback) => {
//   const upperLimit = event.request.intent.slots.UpperLimit.value || 100;
//   const number = getRandomInt(0, upperLimit);
//   const response = {
//     version: '1.0',
//     response: {
//       outputSpeech: {
//         type: 'PlainText',
//         text: `Your lucky number is ${number}`,
//       },
//     },
//   };

//   callback(null, response);
// };


module.exports.skill = (event, context, callback) => {
    const useLocalResources = event.request.debug;
    useLocalResources = true;

    Translations.getResources(useLocalResources)
        .then(function (data) {

            const alexa = Alexa.handler(event, context);
            alexa.appId = Config.skillAppID;
            // alexa.dynamoDBTableName = Config.dynamoDBTableName;
            alexa.resources = data;
            alexa.registerHandlers(mainHandlers);
            alexa.execute();
        })
        .catch(function (err) {

            console.log(err.message);
            callback(err.message, null);
        });
};

var mainHandlers = {
    'LaunchRequest': function () {
        var welcome = this.t('welcome', this.t('skill.name'));

        // store in attributes, so that Repeat works
        this.attributes.speechOutput = welcome.speechOutput;
        this.attributes.repromptSpeech = welcome.reprompt;

        this.emit(':ask', welcome.speechOutput, welcome.reprompt);
    },
    'GetNewFactIntent': function () {
        var index = Util.getNextIndex(this.t('facts'), this.attributes, 'visitedFactIndexes', Util.nextIndexOptions.Random);
        FactsHelper.emitFactByNumber.call(this, index + 1);
    },
    'GetFactByNumberIntent': function () {
        var number = parseInt(this.event.request.intent.slots.number.value);
        FactsHelper.emitFactByNumber.call(this, number);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech)
    },
    'AMAZON.HelpIntent': function () {
        var sampleCommands = this.t('sampleCommands');
        var text = _.sampleSize(sampleCommands, 4).join(' ');       
        var speechOutput = this.t('help.speechOutput', text);

        var reprompt = this.t('help.reprompt');

        this.attributes.speechOutput = speechOutput;
        this.attributes.repromptSpeech = reprompt;

        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        var goodbye = this.t('goodbye');

        this.attributes.speechOutput = ' ';
        this.attributes.repromptSpeech = ' ';

        // :tell* or :saveState handler required here to save attributes to DynamoDB
        this.emit(':tell', goodbye.speechOutput); 
    },
    'Unhandled': function () {
        var unhandled = this.t('unhandled');

        this.attributes.speechOutput = unhandled.speechOutput;
        this.attributes.repromptSpeech = unhandled.reprompt;

        this.emit(':ask', unhandled.speechOutput, unhandled.reprompt);
    }
};