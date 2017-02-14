'use strict';
const Alexa = require('alexa-sdk');

const _ = require('lodash');

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

        let response = this.t('welcome', this.t('skill.name')); // example of passing a parameter to a string in translations.json

        AttributesHelper.setRepeat.call(this, response.speechOutput, response.reprompt);

        this.emit(':ask', response.speechOutput, response.reprompt);
    },
    'GetNewFactIntent': function () {

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

            let response = FactsHelper.getFactByIndex.call(this, result.index, isNewSession);

            AttributesHelper.setRepeat.call(this, response.speechOutput, response.reprompt);

            if (isNewSession) {
                this.emit(':tellWithCard', response.speechOutput, response.cardTitle, response.cardContent);
            }
            else {
                this.emit(':askWithCard', response.speechOutput, response.reprompt, response.cardTitle, response.cardContent);
            }
        }
        catch(err) {

            this.emit('Unhandled');
        }
    },
    'GetFactByNumberIntent': function () {

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

                    let response = FactsHelper.getFactNotFound.call(this, value, isNewSession);

                    AttributesHelper.setRepeat.call(this, response.speechOutput, response.reprompt);

                    if (isNewSession) {
                        this.emit(':tell', response.speechOutput);
                    }
                    else {
                        this.emit(':ask', response.speechOutput, response.reprompt);
                    }

                }
                else {

                    let response = FactsHelper.getFactByIndex.call(this, result.index, isNewSession);

                    AttributesHelper.setRepeat.call(this, response.speechOutput, response.reprompt);


                    if (isNewSession) {
                        this.emit(':tellWithCard', response.speechOutput, response.cardTitle, response.cardContent);
                    }
                    else {
                        this.emit(':askWithCard', response.speechOutput, response.reprompt, response.cardTitle, response.cardContent);
                    }
                }
            }
            catch(err) {

                this.emit('Unhandled');
            }
    },
    'AMAZON.RepeatIntent': function () {
        
        let response = AttributesHelper.getRepeat.call(this);

        this.emit(':ask', response.speechOutput, response.repromptSpeech)
    },
    'AMAZON.HelpIntent': function () {

        let sampleCommands = this.t('sampleCommands');
        let text = _.sampleSize(sampleCommands, 4).join(' ');       
        let speechOutput = this.t('help.speechOutput', text);
        let reprompt = this.t('help.reprompt');
        // let response = this.t('help', text); // example of passing a parameter to a string in translations.json

        AttributesHelper.setRepeat.call(this, speechOutput, reprompt);

        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {

        let response = this.t('goodbye');

        AttributesHelper.clearRepeat.call(this);

        // :tell* or :saveState handler required here to save attributes to DynamoDB
        this.emit(':tell', response.speechOutput); 
    },
    'Unhandled': function () {

        let response = this.t('unhandled');

        AttributesHelper.setRepeat.call(this, response.speechOutput, response.reprompt);

        this.emit(':ask', response.speechOutput, response.reprompt);
    }
};