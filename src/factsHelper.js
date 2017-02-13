'use strict';
const _ = require('lodash');
const util = require('./util');

module.exports = (function () {
    return {

        getFactByIndex: function (index, isNewSession) {

            let list = this.t('facts');
            let item = list[index];
            let reprompt = ' ';

            if (!isNewSession) {
                reprompt = ' <break time=\"500ms\"/> ' + _.sample(this.t('reprompts'));
            }

            let title = this.t('getFact.title', index + 1);
            let speechOutput = title + ': ' + item + reprompt;
            let cardContent = util.replaceTags(item);

            let response = { 
                speechOutput: speechOutput,
                reprompt: reprompt,
                cardTitle: title,
                cardContent: cardContent
            };

            return response;            
        },

        getFactNotFound = function(index, isNewSession) {

            let list = this.t('facts');
            let reprompt = ' ';

            if (!isNewSession) {
                reprompt = ' <break time=\"500ms\"/> ' + _.sample(this.t('reprompts'));
            }
            let speechOutput = this.t('getFact.invalidIndex', index + 1, list.length) + ' ' + reprompt;


            let response = { 
                speechOutput: speechOutput,
                reprompt: reprompt
            };

            return response;
        }        


        // emitFactByNumber: function (itemNumber) {
        //     var reprompt = ' '; // include space to not get Validation Exception on DynamoDB put

        //     //if session.new is true, then this is a full intent so use :tell instead of :ask (no reprompt needed)
        //     if (!this.event.session['new']) {
        //         reprompt = _.sample(this.t('reprompts'));
        //     }

        //     var list = this.t('facts');
        //     var index = itemNumber - 1;
        //     var persistKey = 'visitedFactIndexes';

        //     if (Util.persistIndexToAttributes(list, index, this.attributes, persistKey)) {


        //         var item = list[index];

        //         var title = this.t('getFact.title', itemNumber);
        //         var speechOutput = title + ': ' + item + ' <break time=\"500ms\"/> ' + reprompt;

        //         this.attributes.speechOutput = speechOutput;
        //         this.attributes.repromptSpeech = reprompt;

        //         if (this.event.session['new']) {
        //             this.emit(':tellWithCard', speechOutput, reprompt, title, Util.replaceTags(item));
        //         }
        //         else {
        //             this.emit(':askWithCard', speechOutput, reprompt, title, Util.replaceTags(item));
        //         }
        //     }
        //     else {

        //         reprompt = _.sample(this.t('reprompts'));
        //         var invalidIndex = this.t('getFact.invalidIndex', itemNumber, list.length);
        //         var speechOutput = invalidIndex + ' ' + reprompt;

        //         this.attributes.speechOutput = speechOutput;
        //         this.attributes.repromptSpeech = reprompt;

        //         this.emit(':ask', speechOutput, reprompt);
        //     }
        // }
    };
})();
