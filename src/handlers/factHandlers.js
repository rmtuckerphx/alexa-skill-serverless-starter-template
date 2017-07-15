/*jslint node: true */
"use strict";

console.log('Handler: factHandlers');

const _ = require('lodash');
const ListUtility = require('../util/listUtility');
const Config = require('../config/skill.config');
const bitArrayHelper = require('../util/bitArrayHelper');
//VI-REMOVE:const VoiceLabs = require('voicelabs')(Config.trackingToken);

const factHandlers = {

    'GetNewFactIntent': function () {
        console.log('GetNewFactIntent');

        let visitedKey = 'facts';
        let facts = this.t('facts');
        let factsVisited = [];      

        let ssmlResponse = this.t('factError');

        if (this.attributes[visitedKey]) {
            factsVisited = bitArrayHelper.getArrayOfIndexes(facts.length, this.attributes[visitedKey]);
        }

        let options = {
            sourceListSize: facts.length,
            visitedIndexes: factsVisited
        };

        try {
            let listUtility = new ListUtility(options);
            let result = listUtility.getRandomIndex();

            this.attributes[visitedKey] = bitArrayHelper.toHexString(facts.length, result.newVisitedIndexes);

            let reprompts = this.t('reprompts');
            let reprompt = _.sample(reprompts);   

            ssmlResponse.speechOutput = facts[result.index];
            ssmlResponse.reprompt = reprompt;

            console.log(JSON.stringify(ssmlResponse, null, '  '));              
        }
        catch(err) {
            console.log(err.message);
        }

        this.emit("Private.EmitFact", ssmlResponse);
    },
    'Private.EmitFact': function (ssmlResponse) {

        console.log('Private.EmitFact');

        let intent = this.event.request.intent;
        let isNewSession = this.event.session.new;

        console.log('Private.EmitFact VoiceLabs.track');
        //VI-REMOVE:VoiceLabs.track(this.event.session, intent.name, null, ssmlResponse.speechOutput, (error, response) => {

            console.log('error: ' + JSON.stringify(error, null, '  ')  + '; response: ' + JSON.stringify(response, null, '  '));

            if (isNewSession) {
                this.attributes.speechOutput = " ";
                this.attributes.repromptSpeech = " ";

                this.emit(':tell', ssmlResponse.speechOutput);
            }
            else {
                ssmlResponse.speechOutput = ssmlResponse.speechOutput + ' <break time="300ms"/> ' + ssmlResponse.reprompt;

                this.attributes.speechOutput = ssmlResponse.speechOutput;
                this.attributes.repromptSpeech = ssmlResponse.reprompt;

                this.emit(':ask', ssmlResponse.speechOutput, ssmlResponse.reprompt);
            }
        //VI-REMOVE:});


    }
};

module.exports = factHandlers;