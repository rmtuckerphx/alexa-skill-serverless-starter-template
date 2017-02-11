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
const ListUtility = require('./listUtility');

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

        let facts = this.t('facts');
        let attributeStore = new AttributeStore(this.attributes);
        let factService = new FactService(this.t);
        let visited = attributeStore.get('visitedFactIndexes', []);
        attributeStore.clearRepeat();

        let isNewSession = this.event.session.new;

        let options = {
            sourceListSize: facts.length,
            visitedIndexes: visited
        };

        try {

            let listUtility = new ListUtility(options);
            let result = listUtility.getRandomIndex();
            attributeStore.set('visitedFactIndexes', result.newVisitedIndexes);

            let response = factService.getFactByIndex(result.index, isNewSession);

            attributeStore.setRepeat(response.speechOutput, response.reprompt);

            if (isNewSession) {
                this.emit(':tellWithCard', response.speechOutput, response.cardTitle, response.cardContent);
            }
            else {
                this.emit(':askWithCard', response.speechOutput, response.reprompt, response.cardTitle, response.cardContent);
            }

            // if (index > facts.length) {
            //     let response = factService.getFactNotFound()

            //     attributeStore.setRepeat(response.speechOutput, response.reprompt);

            //     this.emit(':ask', response.speechOutput, response.reprompt);
            // }


        }
        catch(err) {

            this.emit('Unhandled');
        }




        // var index = Util.getNextIndex(this.t('facts'), this.attributes, 'visitedFactIndexes', Util.nextIndexOptions.Random);
        FactsHelper.emitFactByNumber.call(this, index + 1);
    },
    'GetFactByNumberIntent': function () {

        //TODO: Finish this
        let facts = this.t('facts');
        let attributeStore = new AttributeStore(this.attributes);
        let factService = new FactService(this.t);
        let visited = attributeStore.get('visitedFactIndexes', []);
        attributeStore.clearRepeat();

        let value = parseInt(this.event.request.intent.slots.number.value);
        let result = listUtility.getIndexFromValue(value);

        if (index > facts.length) {
            let response = factService.getFactNotFound()

            attributeStore.setRepeat(response.speechOutput, response.reprompt);

            if (isNewSession) {
                this.emit(':tellWithCard', response.speechOutput);
            }
            else {
                this.emit(':askWithCard', response.speechOutput, response.reprompt);
            }

        }
        else {
            let options = {
                sourceListSize: facts.length,
                visitedIndexes: visited
            };

            try {

                let listUtility = new ListUtility(options);
                let value = parseInt(this.event.request.intent.slots.number.value);
                let result = listUtility.getIndexFromValue(value);
                attributeStore.set('visitedFactIndexes', result.newVisitedIndexes);

                let response = factService.getFactByIndex(result.index, isNewSession);

                attributeStore.setRepeat(response.speechOutput, response.reprompt);

                if (isNewSession) {
                    this.emit(':tellWithCard', response.speechOutput, response.cardTitle, response.cardContent);
                }
                else {
                    this.emit(':askWithCard', response.speechOutput, response.reprompt, response.cardTitle, response.cardContent);
                }

                // if (index > facts.length) {
                //     let response = factService.getFactNotFound()

                //     attributeStore.setRepeat(response.speechOutput, response.reprompt);

                //     this.emit(':ask', response.speechOutput, response.reprompt);
                // }


            }
            catch(err) {

                this.emit('Unhandled');
            }
        }


        // let attributeStore = new AttributeStore(this.attributes);
        // let factService = new FactService(this.t);
        // let visited = attributeStore.get('visitedFactIndexes', []);
        // attributeStore.clearRepeat();

        // let isNewSession = this.event.session.new;

        // let options = {
        //     sourceListSize: facts.length,
        //     visitedIndexes: visited
        // };




        // var number = parseInt(this.event.request.intent.slots.number.value);
        // FactsHelper.emitFactByNumber.call(this, number);
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