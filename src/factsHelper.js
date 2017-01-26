'use strict';
var _ = require('lodash');
var Util = require('./util');
var sync = require('synchronize');

module.exports = (function () {
    return {

        emitFactByNumber: function (itemNumber) {
            var reprompt = ' '; // include space to not get Validation Exception on DynamoDB put

            //if session.new is true, then this is a full intent so use :tell instead of :ask (no reprompt needed)
            if (!this.event.session['new']) {
                reprompt = _.sample(this.t('reprompts'));
            }

            var list = this.t('facts');
            var index = itemNumber - 1;
            var persistKey = 'visitedFactIndexes';

            if (Util.persistIndexToAttributes(list, index, this.attributes, persistKey)) {


                var item = list[index];

                var title = this.t('getFact.title', itemNumber);
                var speechOutput = title + ': ' + item + ' <break time=\"500ms\"/> ' + reprompt;

                this.attributes.speechOutput = speechOutput;
                this.attributes.repromptSpeech = reprompt;

                if (this.event.session['new']) {
                    this.emit(':tellWithCard', speechOutput, reprompt, title, Util.replaceTags(item));
                }
                else {
                    this.emit(':askWithCard', speechOutput, reprompt, title, Util.replaceTags(item));
                }
            }
            else {

                reprompt = _.sample(this.t('reprompts'));
                var invalidIndex = this.t('getFact.invalidIndex', itemNumber, list.length);
                var speechOutput = invalidIndex + ' ' + reprompt;

                this.attributes.speechOutput = speechOutput;
                this.attributes.repromptSpeech = reprompt;

                this.emit(':ask', speechOutput, reprompt);
            }
        }
    };
})();
