'use strict';

const visitedFactsKey = 'visitedFactIndexes';

module.exports = (function () {
    return {

        getRepeat: function () {
            let response = { 
                speechOutput: this.attributes.speechOutput,
                reprompt: this.attributes.repromptSpeech
            };

            return response;            
        },        

        setRepeat: function (speechOutput, reprompt) {
            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = reprompt;            
        },

        clearRepeat: function () {
            this.attributes.speechOutput = ' ';
            this.attributes.repromptSpeech = ' ';
        },

        getVisitedFacts: function () {
            if (this.attributes[visitedFactsKey] === undefined) {
                this.attributes[visitedFactsKey] = [];
            }

            return this.attributes[visitedFactsKey];
        },

        setVisitedFacts: function (value) {
            this.attributes[visitedFactsKey] = value;
        }
    };
})();
