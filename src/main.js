'use strict';
const Alexa = require('alexa-sdk');
const _ = require('lodash');
//VI-REMOVE:const VoiceInsights = require('voice-insights-sdk');

const Translations = require('./translations');
const Config = require('./config/skill.config');
const FactsHelper = require('./factsHelper');
const AttributesHelper = require('./attributesHelper');
const ListUtility = require('./listUtility');

module.exports.handler = (event, context, callback) => {
    // used for testing and debugging only; not a real request parameter
    let useLocalTranslations = event.request.useLocalTranslations || false;

    // get translation resources from translations.json which could be:
    // 1) json file deployed with lambda function
    // 2) json file deployed to s3 bucket
    // 3) one of the above cached in memory with this instance of the lambda function
    Translations.getResources(useLocalTranslations)
        .then(function (data) {

            const alexa = Alexa.handler(event, context);            
            alexa.appId = Config.skillAppID;

            //VI-REMOVE:VoiceInsights.initialize(event.session, Config.trackingToken);
            
            // uncomment to save user values to DynamoDB
            // alexa.dynamoDBTableName = Config.dynamoDBTableName;

            alexa.resources = data; //translations
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

        let ssmlResponse = this.t('welcome', this.t('skill.name')); // example of passing a parameter to a string in translations.json

        AttributesHelper.setRepeat.call(this, ssmlResponse.speechOutput, ssmlResponse.reprompt);

        //VI-REMOVE:VoiceInsights.track('LaunchRequest', null, ssmlResponse.speechOutput, (error, response) => {
            this.emit(':ask', ssmlResponse.speechOutput, ssmlResponse.reprompt);
        //VI-REMOVE:});
    },

    'GetNewFactIntent': function () {

        //VI-REMOVE:let intent = this.event.request.intent;
        let facts = this.t('facts');
        let visited = AttributesHelper.getVisitedFacts.call(this);
        AttributesHelper.clearRepeat.call(this);

        let isNewSession = this.event.session.new;

        let options = {
            sourceListSize: facts.length,
            visitedIndexes: visited
        };

        try {

            let listUtility = new ListUtility(options);
            let result = listUtility.getRandomIndex();

            AttributesHelper.setVisitedFacts.call(this, result.newVisitedIndexes);

            let ssmlResponse = FactsHelper.getFactByIndex.call(this, result.index, isNewSession);

            AttributesHelper.setRepeat.call(this, ssmlResponse.speechOutput, ssmlResponse.reprompt);

            if (isNewSession) {

                //VI-REMOVE:VoiceInsights.track(intent.name, null, ssmlResponse.speechOutput, (error, response) => {
                    this.emit(':tellWithCard', ssmlResponse.speechOutput, ssmlResponse.cardTitle, ssmlResponse.cardContent, ssmlResponse.cardImages);
                //VI-REMOVE:});
            }
            else {

                //VI-REMOVE:VoiceInsights.track(intent.name, null, ssmlResponse.speechOutput, (error, response) => {
                    this.emit(':askWithCard', ssmlResponse.speechOutput, ssmlResponse.reprompt, ssmlResponse.cardTitle, ssmlResponse.cardContent, ssmlResponse.cardImages);
                //VI-REMOVE:});
            }
        }
        catch(err) {

            this.emit('Unhandled');
        }
    },

    'GetFactByNumberIntent': function () {

        //VI-REMOVE:let intent = this.event.request.intent;
        let facts = this.t('facts');
        let isNewSession = this.event.session.new;
        AttributesHelper.clearRepeat.call(this);

        let value = parseInt(this.event.request.intent.slots.number.value);
        let visited = AttributesHelper.getVisitedFacts.call(this);

        let options = {
            sourceListSize: facts.length,
            visitedIndexes: visited
        };

            try {
                let listUtility = new ListUtility(options);                

                let result = listUtility.getIndexFromValue(value);
                AttributesHelper.setVisitedFacts.call(this, result.newVisitedIndexes);

                if (result.index === -1) {

                    let ssmlResponse = FactsHelper.getFactNotFound.call(this, value, isNewSession);

                    AttributesHelper.setRepeat.call(this, ssmlResponse.speechOutput, ssmlResponse.reprompt);

                    if (isNewSession) {

                        //VI-REMOVE:VoiceInsights.track(intent.name, intent.slots, ssmlResponse.speechOutput, (error, response) => {
                            this.emit(':tell', ssmlResponse.speechOutput);
                        //VI-REMOVE:});
                    }
                    else {

                        //VI-REMOVE:VoiceInsights.track(intent.name, intent.slots, ssmlResponse.speechOutput, (error, response) => {
                            this.emit(':ask', ssmlResponse.speechOutput, ssmlResponse.reprompt);
                        //VI-REMOVE:});
                    }

                }
                else {

                    let ssmlResponse = FactsHelper.getFactByIndex.call(this, result.index, isNewSession);

                    AttributesHelper.setRepeat.call(this, ssmlResponse.speechOutput, ssmlResponse.reprompt);


                    if (isNewSession) {
    
                        //VI-REMOVE:VoiceInsights.track(intent.name, intent.slots, ssmlResponse.speechOutput, (error, response) => {
                            this.emit(':tellWithCard', ssmlResponse.speechOutput, ssmlResponse.cardTitle, ssmlResponse.cardContent, ssmlResponse.cardImages);
                        //VI-REMOVE:});
                    }
                    else {

                        //VI-REMOVE:VoiceInsights.track(intent.name, intent.slots, ssmlResponse.speechOutput, (error, response) => {
                            this.emit(':askWithCard', ssmlResponse.speechOutput, ssmlResponse.reprompt, ssmlResponse.cardTitle, ssmlResponse.cardContent, ssmlResponse.cardImages);
                        //VI-REMOVE:});
                    }
                }
            }
            catch(err) {

                this.emit('Unhandled');
            }
    },

    'AMAZON.RepeatIntent': function () {
        
        //VI-REMOVE:let intent = this.event.request.intent;
        let ssmlResponse = AttributesHelper.getRepeat.call(this);

        //VI-REMOVE:VoiceInsights.track(intent.name, null, ssmlResponse.speechOutput, (error, response) => {
            this.emit(':ask', ssmlResponse.speechOutput, ssmlResponse.reprompt)
        //VI-REMOVE:});
    },

    'AMAZON.HelpIntent': function () {

        //VI-REMOVE:let intent = this.event.request.intent;
        let sampleCommands = this.t('sampleCommands');
        let text = _.sampleSize(sampleCommands, 4).join(' ');       
        let speechOutput = this.t('help.speechOutput', text);
        let reprompt = this.t('help.reprompt');

        AttributesHelper.setRepeat.call(this, speechOutput, reprompt);

        //VI-REMOVE:VoiceInsights.track(intent.name, null, speechOutput, (error, response) => {
            this.emit(':ask', speechOutput, reprompt);
        //VI-REMOVE:});
    },

    'AMAZON.CancelIntent': function () {

        //VI-REMOVE:let intent = this.event.request.intent;

        //VI-REMOVE:VoiceInsights.track(intent.name, null, null, (error, response) => {
            this.emit('SessionEndedRequest');
        //VI-REMOVE:});
    },

    'AMAZON.StopIntent': function () {

        //VI-REMOVE:let intent = this.event.request.intent;

        //VI-REMOVE:VoiceInsights.track(intent.name, null, null, (error, response) => {
            this.emit('SessionEndedRequest');
        //VI-REMOVE:});
    },

    'SessionEndedRequest': function () {

        let ssmlResponse = this.t('goodbye', Config.s3.bucketName);

        AttributesHelper.clearRepeat.call(this);

        //VI-REMOVE:VoiceInsights.track('SessionEnd', null, null, (error, response) => {
            this.emit(':tell', ssmlResponse.speechOutput); // :tell* or :saveState handler required here to save attributes to DynamoDB
        //VI-REMOVE:});
    },

    'Unhandled': function () {

        let ssmlResponse = this.t('unhandled');

        AttributesHelper.setRepeat.call(this, ssmlResponse.speechOutput, ssmlResponse.reprompt);

        //VI-REMOVE:VoiceInsights.track('Unhandled', null, ssmlResponse.speechOutput, (error, response) => {
            this.emit(':ask', ssmlResponse.speechOutput, ssmlResponse.reprompt);
        //VI-REMOVE:});
    }
};