'use strict';
const _ = require('lodash');
const util = require('./util');
const Config = require('./config/skill.config');

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
            let cardImages = this.t('getFact.cardImages', Config.s3.bucketName);

            let response = { 
                speechOutput: speechOutput,
                reprompt: reprompt,
                cardTitle: title,
                cardContent: cardContent,
                cardImages: cardImages
            };

            return response;            
        },

        getFactNotFound: function(value, isNewSession) {

            let list = this.t('facts');
            let reprompt = ' ';

            if (!isNewSession) {
                reprompt = ' <break time=\"500ms\"/> ' + _.sample(this.t('reprompts'));
            }
            let speechOutput = this.t('getFact.invalidIndex', value, list.length) + ' ' + reprompt;


            let response = { 
                speechOutput: speechOutput,
                reprompt: reprompt
            };

            return response;
        }        
    };
})();
