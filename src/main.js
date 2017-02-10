'use strict';
var Alexa = require('alexa-sdk');

var _ = require('lodash');

var Translations = require('./translations');
var Config = require('./config/skill.config');
var Util = require('./util');
var FactsHelper = require('./factsHelper');
const MainService = require('./mainService');
const FactService = require('./factService');
const AttributeStore = require('./attributeStore');

module.exports.handler = (event, context, callback) => {
    // used for testing and debugging only; not a real request parameter
    let useLocalTranslations = event.request.useLocalTranslations || false;

    Translations.getResources(useLocalTranslations)
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

        let mainService = new MainService(this.t);
        let attributeStore = new AttributeStore(this.attributes);

        let response = mainService.getWelcome();

        attributeStore.setRepeat(response.speechOutput, response.reprompt);

        this.emit(':ask', response.speechOutput, response.reprompt);
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
        
        let attributeStore = new AttributeStore(this.attributes);

        let response = attributeStore.getRepeat();

        this.emit(':ask', response.speechOutput, response.repromptSpeech)
    },
    'AMAZON.HelpIntent': function () {

        let mainService = new MainService(this.t);
        let attributeStore = new AttributeStore(this.attributes);

        let response = mainService.getHelp();

        attributeStore.setRepeat(response.speechOutput, response.reprompt);

        this.emit(':ask', response.speechOutput, response.reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {

        let mainService = new MainService(this.t);
        let attributeStore = new AttributeStore(this.attributes);

        let response = mainService.getGoodbye();

        attributeStore.clearRepeat();

        // :tell* or :saveState handler required here to save attributes to DynamoDB
        this.emit(':tell', response.speechOutput); 
    },
    'Unhandled': function () {

        let mainService = new MainService(this.t);
        let attributeStore = new AttributeStore(this.attributes);

        let response = mainService.getUnhandled();

        attributeStore.setRepeat(response.speechOutput, response.reprompt);

        this.emit(':ask', response.speechOutput, response.reprompt);
    }
};